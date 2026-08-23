(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EquipmentCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VALID_SLOTS = ["weapon", "armor", "relic"];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const indexItems = (equipmentData) =>
    new Map((equipmentData?.items || equipmentData || []).map((item) => [item.id, item]));

  function createEmptyLoadout() {
    return { weapon: null, armor: null, relic: null };
  }

  function normalizeLoadout(rawLoadout, equipmentData) {
    const index = indexItems(equipmentData);
    const result = createEmptyLoadout();
    const used = new Set();
    for (const slot of VALID_SLOTS) {
      const id = rawLoadout && typeof rawLoadout[slot] === "string" ? rawLoadout[slot] : null;
      const item = index.get(id);
      if (item && item.slot === slot && !used.has(id)) {
        result[slot] = id;
        used.add(id);
      }
    }
    return result;
  }

  function validateLoadout(loadout, equipmentData, upgrades = []) {
    const normalized = normalizeLoadout(loadout, equipmentData);
    const index = indexItems(equipmentData);
    const ids = Object.values(normalized).filter(Boolean);
    const errors = [];
    for (const id of ids) {
      const item = index.get(id);
      for (const incompatible of item.incompatible || [])
        if (ids.includes(incompatible)) errors.push(`${id}:${incompatible}`);
      for (const upgrade of item.incompatibleUpgrades || [])
        if (upgrades.includes(upgrade)) errors.push(`${id}:${upgrade}`);
    }
    return { valid: errors.length === 0, loadout: normalized, errors };
  }

  function equipItem(loadout, itemId, equipmentData, upgrades = []) {
    const index = indexItems(equipmentData);
    const item = index.get(itemId);
    const current = normalizeLoadout(loadout, equipmentData);
    if (!item || !VALID_SLOTS.includes(item.slot)) return current;
    const next = { ...current, [item.slot]: item.id };
    return validateLoadout(next, equipmentData, upgrades).valid ? next : current;
  }

  function unequipSlot(loadout, slot) {
    const next = { ...createEmptyLoadout(), ...(loadout || {}) };
    if (VALID_SLOTS.includes(slot)) next[slot] = null;
    return next;
  }

  function buildEquipmentStats(baseStats, loadout, equipmentData, upgrades = []) {
    const data = equipmentData || {};
    const limits = data.limits || {};
    const index = indexItems(data);
    const normalized = normalizeLoadout(loadout, data);
    const armor = index.get(normalized.armor);
    const relic = index.get(normalized.relic);
    const am = armor?.modifiers || {};
    const rm = relic?.modifiers || {};
    const hasVectorUpgrade = upgrades.includes("vector-thruster");
    const hasExtended = upgrades.includes("extended-memory");
    let dashCharges = Math.max(baseStats.dashCharges || 1, am.dashCharges || 1);
    dashCharges = Math.min(limits.maxDashCharges ?? 2, dashCharges);
    let dashCd = baseStats.dashCd;
    if (hasVectorUpgrade && am.dashCharges)
      dashCd *= data.upgradeRules?.vectorStackRechargeMultiplier ?? 0.9;
    let memorySeconds = Math.max(hasExtended ? 2 : 0, rm.memorySeconds || 0);
    if (hasExtended && rm.memorySeconds)
      memorySeconds += data.upgradeRules?.extendedMemoryStackBonus ?? 1;
    memorySeconds = Math.min(limits.maxMemorySeconds ?? 3, memorySeconds);
    return {
      ...baseStats,
      maxHp: Math.max(limits.minMaxHp ?? 45, baseStats.maxHp * (am.maxHpMultiplier || 1)),
      speed: baseStats.speed * (am.moveSpeedMultiplier || 1),
      playerDamage: baseStats.playerDamage * (rm.playerDamageMultiplier || 1),
      equipmentPlayerDamageMultiplier: rm.playerDamageMultiplier || 1,
      echoRatio: Math.min(
        limits.maxEchoDamageMultiplier ?? 1.2,
        baseStats.echoRatio * (rm.echoDamageMultiplier || 1)
      ),
      dashCharges,
      dashTime:
        baseStats.dashTime *
        (am.dashDistanceMultiplier ||
          (hasVectorUpgrade ? data.upgradeRules?.vectorDashDistanceMultiplier || 0.88 : 1)),
      dashCd,
      loopShield: am.loopShield || 0,
      shardRadius: Math.min(
        limits.maxShardRadius ?? 220,
        baseStats.shardRadius * (am.shardRadiusMultiplier || 1)
      ),
      memorySeconds,
      overloadDamageMultiplier: rm.overloadDamageMultiplier || 1,
      overloadCooldown: Math.max(
        limits.minOverloadCooldown ?? 0.7,
        baseStats.overloadCooldown * (rm.overloadCooldownMultiplier || 1)
      ),
      loadout: normalized,
    };
  }

  function buildFireProfile(baseProfile, loadout, upgrades, equipmentData) {
    const data = equipmentData || {};
    const index = indexItems(data);
    const normalized = normalizeLoadout(loadout, data);
    const weapon = index.get(normalized.weapon);
    const modifier = weapon?.modifiers || {};
    const fire = weapon?.fireProfile || {};
    const activeUpgrades = Array.isArray(upgrades) ? upgrades : [];
    const incompatible = new Set(weapon?.incompatibleUpgrades || []);
    const profile = {
      weaponId: weapon?.id || null,
      fireType: fire.type || "standard",
      count: fire.projectileCount || 1,
      spread:
        ((fire.spreadDegrees || 0) * Math.PI) / 180 / Math.max(1, (fire.projectileCount || 1) - 1),
      damage: baseProfile.damage * (modifier.damageMultiplier || 1),
      echoBaseDamage:
        (baseProfile.echoBaseDamage ?? baseProfile.damage) * (modifier.damageMultiplier || 1),
      fireInterval: baseProfile.fireInterval * (modifier.fireIntervalMultiplier || 1),
      speed: baseProfile.speed * (fire.speedMultiplier || 1),
      range: baseProfile.range * (fire.rangeMultiplier || 1),
      pierce: fire.pierce || 0,
      size: baseProfile.size || 3,
      coreDamageMultiplier: fire.coreDamageMultiplier || 1,
      charge: baseProfile.charge || 0,
      visualProfile: {
        color: weapon?.visual?.color || baseProfile.visualProfile?.color || "#fff1d7",
        icon: weapon?.visual?.icon || "•",
        profile: weapon?.visual?.profile || "standard",
      },
    };
    const rules = data.upgradeRules || {};
    if (activeUpgrades.includes("split-shot") && !incompatible.has("split-shot")) {
      profile.count = rules.splitShot?.projectileCount || 2;
      profile.spread =
        ((rules.splitShot?.spreadDegrees || 10) * Math.PI) / 180 / Math.max(1, profile.count - 1);
      profile.damage *= rules.splitShot?.damageMultiplier || 0.7;
      profile.echoBaseDamage *= rules.splitShot?.damageMultiplier || 0.7;
      profile.fireType = "split";
    } else if (activeUpgrades.includes("pulse-cannon") && !incompatible.has("pulse-cannon")) {
      profile.damage *= rules.pulseCannon?.damageMultiplier || 1.55;
      profile.echoBaseDamage *= rules.pulseCannon?.damageMultiplier || 1.55;
      profile.fireInterval *= rules.pulseCannon?.fireIntervalMultiplier || 1.62;
      profile.speed = rules.pulseCannon?.projectileSpeed || 650;
      profile.pierce = rules.pulseCannon?.pierce || 3;
      profile.size = rules.pulseCannon?.size || 6;
      profile.fireType = "pulse";
    } else if (activeUpgrades.includes("charge-lance") && !incompatible.has("charge-lance")) {
      const charge = profile.charge;
      profile.damage *= 0.7 + charge * 1.65;
      profile.echoBaseDamage *= 0.7 + charge * 1.65;
      profile.pierce = charge >= 0.82 ? 5 : 0;
      profile.size = 4 + charge * 5;
      profile.speed = 680 + charge * 160;
      profile.fireType = "charge";
    }
    profile.fireInterval = Math.max(data.limits?.minFireInterval ?? 0.12, profile.fireInterval);
    return profile;
  }

  function getEquipmentCandidates({
    items,
    loadout,
    ownedItems = [],
    upgrades = [],
    count = 3,
    rarityWeights = {},
    rng = Math.random,
  }) {
    const owned = new Set(Array.isArray(ownedItems) ? ownedItems : []);
    const equipped = new Set(Object.values(loadout || {}).filter(Boolean));
    const pool = items.filter(
      (item) =>
        !owned.has(item.id) &&
        !equipped.has(item.id) &&
        !(item.incompatibleUpgrades || []).some((id) => upgrades.includes(id))
    );
    const result = [];
    while (pool.length && result.length < count) {
      const availableRarities = [...new Set(pool.map((item) => item.rarity))];
      const total = availableRarities.reduce(
        (sum, rarity) => sum + Math.max(0, rarityWeights[rarity] || 0),
        0
      );
      let selectedRarity = availableRarities[0];
      let chosen;
      if (total > 0) {
        let roll = clamp(rng(), 0, 0.999999999) * total;
        selectedRarity = availableRarities.find((rarity) => {
          roll -= Math.max(0, rarityWeights[rarity] || 0);
          return roll < 0;
        });
        if (!selectedRarity) selectedRarity = availableRarities.at(-1);
        const rarityPool = pool.filter((item) => item.rarity === selectedRarity);
        chosen = rarityPool[Math.floor(clamp(rng(), 0, 0.999999999) * rarityPool.length)];
      } else chosen = pool[Math.floor(clamp(rng(), 0, 0.999999999) * pool.length)];
      const selectedIndex = pool.indexOf(chosen);
      result.push(pool.splice(selectedIndex, 1)[0]);
    }
    return result;
  }

  function shouldOfferEquipmentReward(roomType, chances, rng = Math.random) {
    const chance =
      roomType === "anchor"
        ? chances.anchorRoomChance
        : roomType === "elite"
          ? chances.eliteRoomChance
          : chances.normalRoomChance;
    return clamp(Number(chance) || 0, 0, 1) > clamp(rng(), 0, 0.999999999);
  }

  function claimEquipmentReward({ loadout, ownedItems, itemId, equipmentData, upgrades = [] }) {
    if ((ownedItems || []).includes(itemId))
      return {
        selected: false,
        loadout: normalizeLoadout(loadout, equipmentData),
        ownedItems: [...ownedItems],
      };
    const item = indexItems(equipmentData).get(itemId);
    const nextLoadout = equipItem(loadout, itemId, equipmentData, upgrades);
    if (!item || nextLoadout[item.slot] !== itemId)
      return {
        selected: false,
        loadout: normalizeLoadout(loadout, equipmentData),
        ownedItems: [...(ownedItems || [])],
      };
    return {
      selected: true,
      loadout: nextLoadout,
      ownedItems: [...new Set([...(ownedItems || []), itemId])],
    };
  }

  function snapshotFireProfile(profile) {
    const visual = profile?.visualProfile || {};
    return {
      weaponId: typeof profile?.weaponId === "string" ? profile.weaponId : null,
      fireType: typeof profile?.fireType === "string" ? profile.fireType : "standard",
      angle: Number.isFinite(profile?.angle)
        ? profile.angle
        : Number.isFinite(profile?.a)
          ? profile.a
          : 0,
      count: Math.max(1, Math.floor(profile?.count || 1)),
      spread: Number.isFinite(profile?.spread) ? profile.spread : 0,
      damage: Number.isFinite(profile?.damage) ? profile.damage : 0,
      echoBaseDamage: Number.isFinite(profile?.echoBaseDamage)
        ? profile.echoBaseDamage
        : Number.isFinite(profile?.damage)
          ? profile.damage
          : 0,
      fireInterval: Number.isFinite(profile?.fireInterval) ? profile.fireInterval : 0.22,
      speed: Number.isFinite(profile?.speed) ? profile.speed : 760,
      range: Number.isFinite(profile?.range) ? profile.range : 1064,
      pierce: Math.max(0, Math.floor(profile?.pierce || 0)),
      size: Number.isFinite(profile?.size) ? profile.size : 3,
      charge: Number.isFinite(profile?.charge) ? profile.charge : 0,
      coreDamageMultiplier: Number.isFinite(profile?.coreDamageMultiplier)
        ? profile.coreDamageMultiplier
        : 1,
      visualProfile: {
        color: typeof visual.color === "string" ? visual.color : "#fff1d7",
        icon: typeof visual.icon === "string" ? visual.icon : "•",
        profile: typeof visual.profile === "string" ? visual.profile : "standard",
      },
    };
  }

  function calculateProjectileDamage(
    profile,
    { isEcho = false, echoRatio = 1, overdriveEchoMultiplier = 1 } = {}
  ) {
    if (!isEcho) return Math.max(0, Number(profile?.damage) || 0);
    const base = Number.isFinite(profile?.echoBaseDamage)
      ? profile.echoBaseDamage
      : Number(profile?.damage) || 0;
    return Math.max(0, base * Math.max(0, echoRatio) * Math.max(0, overdriveEchoMultiplier));
  }

  function resolveProjectileImpact(pierce, targetType) {
    if (targetType === "wall" || targetType === "anchor") return { pierce: 0, removed: true };
    const remaining = Math.max(0, Math.floor(pierce || 0));
    return remaining > 0 ? { pierce: remaining - 1, removed: false } : { pierce: 0, removed: true };
  }

  function normalizeEquipmentSave(save, equipmentData) {
    const index = indexItems(equipmentData);
    const owned = [];
    for (const id of Array.isArray(save?.equipmentOwned) ? save.equipmentOwned : [])
      if (index.has(id) && !owned.includes(id)) owned.push(id);
    const loadout = normalizeLoadout(save?.loadout, equipmentData);
    for (const id of Object.values(loadout)) if (id && !owned.includes(id)) owned.push(id);
    return { ...(save || {}), loadout, equipmentOwned: owned };
  }

  function migrateSave(rawSave, defaults, equipmentData, targetVersion) {
    if (!rawSave || typeof rawSave !== "object")
      return normalizeEquipmentSave({ ...defaults }, equipmentData);
    const migrated = {
      ...defaults,
      ...rawSave,
      version: targetVersion,
      stages: rawSave.stages && typeof rawSave.stages === "object" ? rawSave.stages : {},
      upgrades: Array.isArray(rawSave.upgrades) ? rawSave.upgrades.slice() : [],
    };
    return normalizeEquipmentSave(migrated, equipmentData);
  }

  function applyShieldDamage(shield, hp, damage) {
    const absorbed = Math.min(Math.max(0, shield), Math.max(0, damage));
    return {
      shield: Math.max(0, shield - absorbed),
      hp: Math.max(0, hp - (damage - absorbed)),
      absorbed,
    };
  }

  return Object.freeze({
    createEmptyLoadout,
    normalizeLoadout,
    validateLoadout,
    equipItem,
    unequipSlot,
    buildEquipmentStats,
    buildFireProfile,
    getEquipmentCandidates,
    shouldOfferEquipmentReward,
    claimEquipmentReward,
    snapshotFireProfile,
    calculateProjectileDamage,
    resolveProjectileImpact,
    normalizeEquipmentSave,
    migrateSave,
    applyShieldDamage,
  });
});
