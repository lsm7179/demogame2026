"use strict";

// ── 설정 상수와 데이터 ─────────────────────────────────────────────────────
const BASE = Object.freeze({
  W: 1280,
  H: 720,
  SAMPLE: 0.05,
  MAX_ECHOES: 4,
  ACCEL: 13,
  PLAYER_SPEED: 265,
  PLAYER_HP: 100,
  FIRE_RATE: GameBalance.baseFireInterval,
  BULLET_SPEED: 760,
  PLAYER_DAMAGE: 12 * GameBalance.playerCombat.damageMultiplier,
  DASH_SPEED: 720,
  DASH_TIME: 0.14,
  DASH_CD: 1.35,
  INVULN: 0.22,
  CORE_HP: 650,
  RELAY_MAX: 100,
  RELAY_GAIN: 12,
  RELAY_DECAY: 8,
  SHIELD_OPEN: 5.3,
  TRANSITION: 0.9,
});
const LOCALE = CopyData.defaultLocale;
const localized = (group, id) => CopyData.text(group, id, LOCALE);
const uiCopy = () => CopyData.locales[LOCALE]?.ui || CopyData.locales.ko.ui;
const DIFFICULTIES = Object.freeze({
  story: {
    id: "story",
    name: "STORY",
    loopTime: 25,
    maxLoops: 6,
    enemyBullet: 0.8,
    damageTaken: 0.7,
    dashCd: 0.82,
    relayDecay: 0.6,
    shieldTime: 6.2,
    enemyMix: 1,
    scoreMult: 0.8,
    help: "목표선과 장치 안내 강화",
  },
  operative: {
    id: "operative",
    name: "OPERATIVE",
    loopTime: 20,
    maxLoops: 5,
    enemyBullet: 1,
    damageTaken: 1,
    dashCd: 1,
    relayDecay: 1,
    shieldTime: 5.3,
    enemyMix: 1,
    scoreMult: 1,
    help: "표준 NEXUS 전투 규약",
  },
  paradox: {
    id: "paradox",
    name: "PARADOX",
    loopTime: 18,
    maxLoops: 5,
    enemyBullet: 1.18,
    damageTaken: 1.08,
    dashCd: 1,
    relayDecay: 1.35,
    shieldTime: 4.4,
    enemyMix: 1.25,
    scoreMult: 1.35,
    help: "빠른 탄환과 강화된 조합",
  },
});
const STAGES = [
  {
    id: "awakening",
    number: 1,
    name: "AWAKENING",
    subtitle: "Temporal Lab A-01",
    briefing: [
      "NEXUS가 파괴 직전의 순간을 반복하고 있다.",
      "Chrono Anchor를 파괴해야 이 구역의 시간이 흐른다.",
    ],
    arena: { type: "radial", tint: "#07101d" },
    visual: {
      color: "#45f5e9",
      motif: "awakening",
      preview: "linear-gradient(145deg,#0c3340,#07101d 62%)",
    },
    difficulty: { coreHp: 650 },
    objective: ObjectiveData.awakening,
    waves: [["chaser", "shooter", "blocker"]],
    unlock: 1,
    rewards: ["weapon", "time", "hull"],
    ranks: { S: 900, A: 720, B: 520 },
  },
  {
    id: "split-current",
    number: 2,
    name: "SPLIT CURRENT",
    subtitle: "Conduit Divide B-04",
    briefing: [
      "에너지 장벽이 구역을 양분했다.",
      "Echo의 사격으로 스위치를 유지하고 열린 통로를 돌파하라.",
    ],
    arena: { type: "split", tint: "#07131a" },
    visual: {
      color: "#73a7ff",
      motif: "split",
      preview: "linear-gradient(145deg,#13284b,#07131a 62%)",
    },
    difficulty: { coreHp: 720 },
    objective: ObjectiveData["split-current"],
    waves: [["shooter", "chaser", "blocker", "shooter"]],
    unlock: 2,
    rewards: ["weapon", "time"],
    ranks: { S: 980, A: 760, B: 540 },
  },
  {
    id: "rescue-window",
    number: 3,
    name: "RESCUE WINDOW",
    subtitle: "Evacuation Deck C-09",
    briefing: [
      "탈출선에 생존자 12명이 탑승 중이다.",
      "Echo에게 호위 사격을 남기고 Anchor를 공략하라.",
    ],
    arena: { type: "rescue", tint: "#100b19" },
    visual: {
      color: "#cf84ff",
      motif: "rescue",
      preview: "linear-gradient(145deg,#321844,#100b19 62%)",
    },
    difficulty: { coreHp: 760 },
    objective: ObjectiveData["rescue-window"],
    waves: [["chaser", "shooter", "chaser", "blocker"]],
    unlock: 3,
    rewards: ["hull", "time", "weapon"],
    ranks: { S: 1050, A: 800, B: 570 },
  },
  {
    id: "corrupted-record",
    number: 4,
    name: "CORRUPTED RECORD",
    subtitle: "Hostile Memory Vault",
    briefing: [
      "보관소가 ECHO-07의 전투 기록을 오염시켰다.",
      "반복한 경로를 추적하는 적대적 Echo를 피해 Anchor를 파괴하라.",
    ],
    arena: { type: "continuous", tint: "#0c0710" },
    visual: {
      color: "#ff607c",
      motif: "corrupted",
      preview: "linear-gradient(145deg,#361322,#0c0710 62%)",
    },
    difficulty: { coreHp: 820 },
    objective: ObjectiveData["corrupted-record"],
    waves: [["corrupted-echo", "blocker", "shooter"]],
    unlock: 4,
    rewards: ["time", "weapon", "hull"],
    ranks: { S: 1120, A: 850, B: 610 },
  },
  {
    id: "prime-anchor",
    number: 5,
    name: "PRIME ANCHOR",
    subtitle: "Central AI Core",
    briefing: [
      "중앙 AI가 모든 시간선을 PRIME Anchor에 결속했다.",
      "세 수렴점을 Echo와 동기화하고 중앙 의식을 정지시켜라.",
    ],
    arena: { type: "continuous", tint: "#0d0a05" },
    visual: {
      color: "#ffd36f",
      motif: "prime",
      preview: "linear-gradient(145deg,#352b14,#0d0a05 62%)",
    },
    difficulty: { coreHp: 900 },
    objective: ObjectiveData["prime-anchor"],
    waves: [["prime-weaver", "core-guard", "corrupted-echo"]],
    unlock: 5,
    rewards: ["time", "weapon", "hull"],
    ranks: { S: 1250, A: 940, B: 680 },
  },
];
const UPGRADES = [
  {
    id: "split-shot",
    category: "WEAPON",
    rarity: "rare",
    incompatible: ["pulse-cannon", "charge-lance"],
  },
  {
    id: "pulse-cannon",
    category: "WEAPON",
    rarity: "rare",
    incompatible: ["split-shot", "charge-lance"],
  },
  {
    id: "charge-lance",
    category: "WEAPON",
    rarity: "epic",
    incompatible: ["split-shot", "pulse-cannon"],
  },
  {
    id: "echo-amplifier",
    category: "TIME",
    rarity: "epic",
    incompatible: [],
  },
  {
    id: "extended-memory",
    category: "TIME",
    rarity: "rare",
    incompatible: [],
  },
  {
    id: "record-override",
    category: "TIME",
    rarity: "rare",
    incompatible: [],
  },
  {
    id: "reinforced-hull",
    category: "HULL",
    rarity: "common",
    incompatible: [],
  },
  {
    id: "vector-thruster",
    category: "HULL",
    rarity: "rare",
    incompatible: [],
  },
  {
    id: "emergency-rewind",
    category: "HULL",
    rarity: "epic",
    incompatible: [],
  },
];
const SAVE_KEY = "echoBreachCampaign",
  SAVE_VERSION = 3;

// ── DOM 참조와 상태 ────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id),
  canvas = $("game"),
  ctx = canvas.getContext("2d");
const screens = [
  "title",
  "confirm",
  "difficulty",
  "stage",
  "briefing",
  "pause",
  "transition",
  "override",
  "result",
  "ending",
  "upgrade",
  "equipment",
].reduce((o, n) => ((o[n] = $(n + "-screen")), o), {});
const ui = {
  hud: $("hud"),
  stage: $("stage-hud"),
  loop: $("loop-value"),
  time: $("time-value"),
  echoes: $("echo-value"),
  hp: $("hp-bar"),
  shieldHud: $("shield-hud"),
  shield: $("shield-bar"),
  shieldValue: $("shield-value"),
  dash: $("dash-bar"),
  overdrive: $("overdrive-bar"),
  overdriveLabel: $("overdrive-label"),
  core: $("core-bar"),
  score: $("score-value"),
  objective: $("objective"),
  tip: $("tip"),
  shuttleHud: $("shuttle-hud"),
  shuttle: $("shuttle-bar"),
  survivors: $("survivor-value"),
  muteTitle: $("mute-title"),
  muteGame: $("mute-game"),
  loadout: $("loadout-hud"),
};
let save = loadSave(),
  state = freshState(),
  stage = STAGES[0],
  diff = DIFFICULTIES.operative,
  stats = buildStats(),
  player = null,
  core = null,
  relays = [],
  switches = [],
  walls = [],
  rooms = [],
  shuttle = null,
  enemies = [],
  bullets = [],
  particles = [],
  pickups = [],
  explosions = [],
  warnings = [],
  echoes = [],
  recordings = [];
let corruptedSpawnSequence = 0;
let pendingEquipmentFlow = null,
  equipmentSelectionLocked = false;
let raf = 0,
  last = 0,
  accumulator = 0,
  shake = 0,
  flash = 0,
  hitStop = 0,
  timeWarp = 0,
  transitionTimer = 0,
  audio = null,
  sfxBus = null,
  musicBus = null,
  activeSfx = 0,
  musicBeat = 0,
  musicNextBeat = 0,
  musicScene = "combat",
  muted = save.muted,
  view = { scale: 1, ox: 0, oy: 0 },
  camera = { x: 0, y: 0 };
const keys = Object.create(null),
  mouse = { x: 640, y: 360, sx: 640, sy: 360, inside: false };
const mobileInput = {
    move: { x: 0, y: 0, active: false },
    aim: { x: 0, y: 0, active: false },
  },
  gamepadLatch = { dash: false, pause: false, select: false, navigation: false };
let gamepadInput = null;
const PLAYTEST_STORAGE_KEY = "echoBreachPlaytestsV2";
const playtestEnabled = ["127.0.0.1", "localhost"].includes(location.hostname);

function readPlaytestRuns() {
  if (!playtestEnabled) return [];
  try {
    return PlaytestCore.normalizeRuns(
      JSON.parse(localStorage.getItem(PLAYTEST_STORAGE_KEY) || "[]")
    );
  } catch {
    return [];
  }
}

function writePlaytestRun(run) {
  if (!playtestEnabled || !run) return;
  try {
    localStorage.setItem(
      PLAYTEST_STORAGE_KEY,
      JSON.stringify(PlaytestCore.normalizeRuns([...readPlaytestRuns(), run]))
    );
  } catch {}
}

function writeLatestPlaytestReward(itemId) {
  if (!playtestEnabled) return;
  const runs = readPlaytestRuns();
  if (!runs.length) return;
  const latest = runs.at(-1);
  latest.rewardChoices = [...(latest.rewardChoices || []), itemId];
  try {
    localStorage.setItem(PLAYTEST_STORAGE_KEY, JSON.stringify(runs));
  } catch {}
}

function damageSourceId(from) {
  if (from?.sourceType) return from.sourceType;
  if (from?.type) return from.type;
  if (from?.exploded !== undefined) return "rift-explosion";
  return "unknown";
}
function freshState() {
  return {
    mode: "title",
    loop: 1,
    elapsed: 0,
    stageActiveSeconds: 0,
    paused: false,
    score: 0,
    kills: 0,
    coreDamage: 0,
    damageTaken: 0,
    echoDamage: 0,
    totalCoreHits: 0,
    echoCoreHits: 0,
    combo: 0,
    bestCombo: 0,
    lastKill: -9,
    lastEchoKill: -9,
    synergyKillState: {},
    noHit: true,
    shieldTimer: 0,
    ending: false,
    charge: 0,
    charging: false,
    emergencyUsed: false,
    shuttleHp: 260,
    roomIndex: 0,
    roomCleared: false,
    roomTransition: 0,
    slowTimer: 0,
    overdriveGauge: 0,
    overdriveTimer: 0,
    lastPlayerCoreHit: -9,
    lastEchoCoreHit: -9,
    lastOverload: -9,
    overloads: 0,
    playtestRun: null,
    playtestSample: 0,
    playtestLastX: 0,
    playtestLastY: 0,
    deathCause: null,
    anchorPhase: "armored",
    overloadText: 0,
    overloadLabel: "시간 과부하",
    collapsing: false,
    roomRewardResolved: false,
    shieldRefresh: true,
    history: [],
    hazardCooldowns: {},
    zoneProgress: {},
    shuttleAlert: 0,
    shuttleAlertSound: 0,
    failureReason: null,
  };
}
function buildStats() {
  const has = (id) => save.upgrades.includes(id),
    weapon = has("split-shot")
      ? "split"
      : has("pulse-cannon")
        ? "pulse"
        : has("charge-lance")
          ? "charge"
          : "standard";
  const baseStats = {
    weapon,
    maxHp: BASE.PLAYER_HP + (has("reinforced-hull") ? 35 : 0),
    speed: BASE.PLAYER_SPEED * (has("reinforced-hull") ? 0.93 : 1),
    playerDamage: BASE.PLAYER_DAMAGE * (has("echo-amplifier") ? 0.92 : 1),
    echoRatio: has("echo-amplifier") ? 0.8 : 0.65,
    fireRate: BASE.FIRE_RATE,
    dashCd: BASE.DASH_CD * diff.dashCd,
    dashCharges: has("vector-thruster") ? 2 : 1,
    dashTime: BASE.DASH_TIME,
    shardRadius: GameBalance.overdrive.pickupRadius,
    overloadCooldown: GameBalance.overload.cooldown,
    extended: has("extended-memory"),
    override: has("record-override"),
    emergency: has("emergency-rewind"),
  };
  return EquipmentCore.buildEquipmentStats(baseStats, save.loadout, EquipmentData, save.upgrades);
}

// ── 안전한 캠페인 저장 ─────────────────────────────────────────────────────
function defaultSave() {
  return {
    version: SAVE_VERSION,
    difficulty: "operative",
    unlockedStage: 1,
    stages: {},
    upgrades: [],
    loadout: EquipmentCore.createEmptyLoadout(),
    equipmentOwned: [],
    muted: false,
    audioSettings: AudioCore.normalizeSettings(),
    campaignComplete: false,
    hasCampaign: false,
  };
}
function loadSave() {
  try {
    const x = JSON.parse(localStorage.getItem(SAVE_KEY));
    const migrated = EquipmentCore.migrateSave(x, defaultSave(), EquipmentData, SAVE_VERSION);
    migrated.upgrades = migrated.upgrades.filter((id) => UPGRADES.some((u) => u.id === id));
    migrated.audioSettings = AudioCore.normalizeSettings(migrated.audioSettings);
    return migrated;
  } catch {
    return defaultSave();
  }
}
function persist() {
  save.muted = muted;
  save.audioSettings = AudioCore.normalizeSettings(save.audioSettings);
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* storage denied */
  }
}
function newCampaign() {
  save = defaultSave();
  save.hasCampaign = true;
  save.difficulty = diff.id;
  persist();
  showStageSelect();
}

// ── 입력과 오디오 ──────────────────────────────────────────────────────────
function bindInputs() {
  addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (["Space", "KeyR", "Escape"].includes(e.code)) e.preventDefault();
    if (e.code === "Space" && state.mode === "playing") tryDash(player, true);
    if (e.code === "KeyR" && state.mode === "playing" && !state.paused) endLoop("early");
    if (e.code === "Escape" && state.mode === "playing") togglePause();
    if (e.code === "KeyM") toggleMute();
    if (state.mode === "equipmentSelect" && ["ArrowLeft", "ArrowRight"].includes(e.code)) {
      e.preventDefault();
      const cards = [...$("equipment-cards").querySelectorAll("button:not(:disabled)")];
      const index = Math.max(0, cards.indexOf(document.activeElement));
      const direction = e.code === "ArrowRight" ? 1 : -1;
      cards[(index + direction + cards.length) % cards.length]?.focus();
    }
  });
  addEventListener("keyup", (e) => (keys[e.code] = false));
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.sx = e.clientX - r.left;
    mouse.sy = e.clientY - r.top;
    updateMouseWorld();
    mouse.inside = true;
  });
  canvas.addEventListener("pointerenter", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.sx = e.clientX - r.left;
    mouse.sy = e.clientY - r.top;
    updateMouseWorld();
    mouse.inside = true;
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button === 0) initAudio();
  });
  canvas.addEventListener("pointerleave", () => (mouse.inside = false));
  addEventListener("blur", () => {
    if (state.mode === "playing" && !state.paused) togglePause(true);
  });
  document.addEventListener("visibilitychange", () => {
    last = performance.now();
    if (document.hidden && state.mode === "playing" && !state.paused) togglePause(true);
  });
  document.querySelectorAll("[data-stick]").forEach(bindTouchStick);
  $("touch-dash").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    initAudio();
    if (state.mode === "playing" && !state.paused) tryDash(player, true);
  });
}
function bindTouchStick(element) {
  const target = mobileInput[element.dataset.stick];
  let pointerId = null;
  const move = (event) => {
    if (event.pointerId !== pointerId) return;
    const rect = element.getBoundingClientRect();
    const rawX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.38);
    const rawY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.38);
    const value = InputCore.stick(rawX, rawY, 0.08);
    Object.assign(target, value);
    element.style.setProperty("--stick-x", `${value.x * 36}px`);
    element.style.setProperty("--stick-y", `${value.y * 36}px`);
  };
  const release = (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    Object.assign(target, { x: 0, y: 0, active: false });
    element.style.setProperty("--stick-x", "0px");
    element.style.setProperty("--stick-y", "0px");
  };
  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pointerId = event.pointerId;
    element.setPointerCapture(pointerId);
    initAudio();
    move(event);
  });
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", release);
  element.addEventListener("pointercancel", release);
}
function pollGamepad() {
  const pad = Array.from(navigator.getGamepads?.() || []).find(Boolean);
  gamepadInput = InputCore.gamepadState(pad);
  if (!gamepadInput) return;
  if (gamepadInput.dash && !gamepadLatch.dash && state.mode === "playing" && !state.paused)
    tryDash(player, true);
  if (gamepadInput.pause && !gamepadLatch.pause && state.mode === "playing") togglePause();
  const select = Boolean(pad.buttons?.[0]?.pressed);
  const navigation = gamepadInput.navX || gamepadInput.navY;
  if (navigation && !gamepadLatch.navigation && state.mode !== "playing") {
    const buttons = [...document.querySelectorAll("button:not([disabled])")].filter(
      (button) => button.offsetParent !== null
    );
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    const direction = gamepadInput.navX < 0 || gamepadInput.navY < 0 ? -1 : 1;
    buttons[(current + direction + buttons.length) % buttons.length]?.focus();
  }
  if (select && !gamepadLatch.select && state.mode !== "playing") document.activeElement?.click?.();
  gamepadLatch.dash = gamepadInput.dash;
  gamepadLatch.pause = gamepadInput.pause;
  gamepadLatch.select = select;
  gamepadLatch.navigation = Boolean(navigation);
}
function initAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    sfxBus = audio.createGain();
    musicBus = audio.createGain();
    sfxBus.connect(audio.destination);
    musicBus.connect(audio.destination);
  }
  const settings = AudioCore.normalizeSettings(save.audioSettings);
  sfxBus.gain.value = settings.effects;
  musicBus.gain.value = settings.music;
  if (audio.state === "suspended") audio.resume();
}
function tone(type, freq, duration = 0.08, volume = 0.05, slide = 0) {
  if (muted || !audio || activeSfx >= 18) return;
  activeSfx++;
  const t = audio.currentTime,
    o = audio.createOscillator(),
    g = audio.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + duration);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  o.connect(g).connect(sfxBus);
  o.onended = () => (activeSfx = Math.max(0, activeSfx - 1));
  o.start(t);
  o.stop(t + duration);
}
function musicTone(freq, duration, accent = false) {
  if (muted || !audio || state.paused || state.mode !== "playing") return;
  const t = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = accent ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(accent ? 0.055 : 0.035, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  oscillator.connect(gain).connect(musicBus);
  oscillator.start(t);
  oscillator.stop(t + duration);
}
function playCue(name) {
  for (const note of AudioCore.CUES[name] || [])
    setTimeout(
      () => tone(note.type, note.frequency, note.duration, note.volume, note.slide),
      (note.delay || 0) * 1000
    );
}
function updateMusic() {
  if (!audio || muted || state.paused || state.mode !== "playing") return;
  const world = activeWorld();
  const zone = world ? WorldCore.zoneAt(world.zones, player) : null;
  const zoneIndex = world && zone ? world.zones.indexOf(zone) : 0;
  const blocked = Boolean(
    zone &&
      world?.progressionGates?.some(
        (gate) => gate.zoneId === zone.id && !state.zoneProgress[zone.id]?.complete
      )
  );
  const nextScene = AudioCore.sceneFor({
    bossAlive: enemies.some((enemy) => enemy.alive && enemy.boss),
    blocked,
    zoneIndex,
    zoneCount: world?.zones.length || 1,
  });
  if (nextScene !== musicScene) {
    musicScene = nextScene;
    musicBeat = 0;
    musicNextBeat = audio.currentTime;
  }
  if (audio.currentTime < musicNextBeat) return;
  const beatLength = AudioCore.beatDuration(musicScene);
  const note = AudioCore.noteFor(musicScene, musicBeat);
  musicTone(note, beatLength * 0.9, musicBeat % 4 === 0);
  if (musicBeat % 2 === 0) musicTone(note * 2, beatLength * 0.28, true);
  musicBeat++;
  musicNextBeat = audio.currentTime + beatLength;
}
const sfx = {
  shot: () => tone("square", 210, 0.045, 0.03, -60),
  echo: () => tone("sine", 520, 0.055, 0.02, -180),
  hurt: () => tone("sawtooth", 85, 0.18, 0.09, -40),
  dash: () => tone("triangle", 360, 0.12, 0.05, 500),
  enemyHit: (heavy = false) =>
    tone(heavy ? "sawtooth" : "triangle", heavy ? 145 : 280, heavy ? 0.09 : 0.045, 0.025, -70),
  kill: (elite = false) =>
    tone(elite ? "square" : "triangle", elite ? 120 : 410, elite ? 0.24 : 0.1, 0.045, 180),
  relay: () => tone("sine", 520, 0.28, 0.06, 500),
  shield: () => tone("sawtooth", 180, 0.42, 0.07, 680),
  loop: () => tone("square", 170, 0.34, 0.06, -110),
  win: () =>
    [330, 440, 660].forEach((f, i) => setTimeout(() => tone("sine", f, 0.4, 0.07, 180), i * 120)),
  lose: () => tone("sawtooth", 180, 0.7, 0.07, -120),
};
function toggleMute() {
  muted = !muted;
  ui.muteTitle.textContent = `소리: ${muted ? "끔" : "켬"}`;
  ui.muteGame.textContent = muted ? "M×" : "M";
  persist();
}
function updateAudioSettings() {
  save.audioSettings = AudioCore.normalizeSettings({
    music: Number($("music-volume").value) / 100,
    effects: Number($("effects-volume").value) / 100,
  });
  if (musicBus) musicBus.gain.value = save.audioSettings.music;
  if (sfxBus) sfxBus.gain.value = save.audioSettings.effects;
  persist();
}

// ── 유틸리티와 아레나 충돌 ─────────────────────────────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp = (a, b, t) => a + (b - a) * t,
  dist2 = (a, b) => {
    const x = a.x - b.x,
      y = a.y - b.y;
    return x * x + y * y;
  };
function reducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function norm(x, y) {
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}
function hit(a, b) {
  const r = a.r + b.r;
  return dist2(a, b) < r * r;
}
function playerProjectileHitsEnemy(projectile, enemy) {
  const r = GameBalance.playerProjectileHitRadius(projectile.r, enemy.r);
  return dist2(projectile, enemy) < r * r;
}
function poly(x, y, r, n, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i * Math.PI * 2) / n;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
}
function activeWorld() {
  const world = WorldData[stage?.id];
  return world?.mode === "continuous" ? world : null;
}
function worldSize() {
  const world = activeWorld();
  return { width: world?.width || BASE.W, height: world?.height || BASE.H };
}
function activeObjective() {
  return activeWorld()?.objective || stage.objective;
}
function updateMouseWorld() {
  const point = WorldCore.screenToWorld({ x: mouse.sx, y: mouse.sy }, camera, view);
  mouse.x = point.x;
  mouse.y = point.y;
}
function updateCameraTracking(dt, snap = false) {
  const world = activeWorld();
  if (!world || !player) {
    camera = { x: 0, y: 0 };
  } else if (snap) {
    camera = WorldCore.cameraForFocus(player, world, { width: BASE.W, height: BASE.H });
  } else {
    camera = WorldCore.updateCamera(
      camera,
      player,
      dt,
      world,
      { width: BASE.W, height: BASE.H },
      world.cameraFollowRate
    );
  }
  updateMouseWorld();
}
function moveActor(o, dx, dy) {
  const size = worldSize();
  const collision = CollisionCore.moveCircle(o, dx, dy, walls, {
    minX: 42,
    maxX: size.width - 42,
    minY: 55,
    maxY: size.height - 42,
  });
  if (collision.blockedX) o.vx = 0;
  if (collision.blockedY) o.vy = 0;
}
function randomEdge() {
  const points = currentEncounter()?.spawnPoints || RoomData[stage.id]?.spawnPoints;
  if (points?.length) return { ...points[Math.floor(Math.random() * points.length)] };
  const side = Math.floor(Math.random() * 4),
    p = 88;
  return side === 0
    ? { x: p, y: p }
    : side === 1
      ? { x: BASE.W - p, y: p }
      : side === 2
        ? { x: p, y: BASE.H - p }
        : { x: BASE.W - p, y: BASE.H - p };
}

// ── 플레이어와 업그레이드 동작 ─────────────────────────────────────────────
function makePlayer() {
  const start = activeWorld()?.playerStart || currentEncounter()?.playerStart;
  return {
    x: start?.x ?? (stage.number === 2 ? 220 : 640),
    y: start?.y ?? 630,
    r: 15,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    hp: stats.maxHp,
    shield: state.shieldRefresh ? stats.loopShield : 0,
    fireCd: 0,
    dashCd: 0,
    dashStock: stats.dashCharges,
    dashLeft: 0,
    invuln: 0,
    animTime: 0,
    motion: 0,
    recoil: 0,
    hurtAnim: 0,
  };
}
function updatePlayer(dt) {
  let ix = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0),
    iy = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0);
  const alternateMove = mobileInput.move.active
    ? mobileInput.move
    : gamepadInput?.move.active
      ? gamepadInput.move
      : null;
  if (alternateMove) {
    ix = alternateMove.x;
    iy = alternateMove.y;
  }
  let n = norm(ix, iy);
  if (!ix && !iy) n = { x: 0, y: 0 };
  const blend = 1 - Math.exp(-BASE.ACCEL * dt);
  state.slowTimer = Math.max(0, state.slowTimer - dt);
  const moveSpeed = stats.speed * (state.slowTimer > 0 ? 0.78 : 1);
  player.vx = lerp(player.vx, n.x * moveSpeed, blend);
  player.vy = lerp(player.vy, n.y * moveSpeed, blend);
  let moveX, moveY;
  if (player.dashLeft > 0) {
    player.dashLeft -= dt;
    moveX = player.dashX * BASE.DASH_SPEED * dt;
    moveY = player.dashY * BASE.DASH_SPEED * dt;
    trail(player, "#ffb45d");
  } else {
    moveX = player.vx * dt;
    moveY = player.vy * dt;
  }
  moveActor(player, moveX, moveY);
  const alternateAim = mobileInput.aim.active
    ? mobileInput.aim
    : gamepadInput?.aim.active
      ? gamepadInput.aim
      : null;
  player.angle = alternateAim
    ? Math.atan2(alternateAim.y, alternateAim.x)
    : Math.atan2(mouse.y - player.y, mouse.x - player.x);
  player.fireCd -= dt;
  player.invuln -= dt;
  player.recoil = Math.max(0, player.recoil - dt * 9);
  player.hurtAnim = Math.max(0, player.hurtAnim - dt * 7);
  player.motion = clamp(Math.hypot(player.vx, player.vy) / moveSpeed, 0, 1);
  player.animTime += dt * (2.5 + player.motion * 8);
  if (player.dashStock < stats.dashCharges) {
    player.dashCd -= dt;
    if (player.dashCd <= 0) {
      player.dashStock++;
      player.dashCd = player.dashStock < stats.dashCharges ? stats.dashCd : 0;
    }
  }
  const autoFire = EchoCore.canAutoFire({
    mode: state.mode,
    paused: state.paused,
    mouseInside: mouse.inside || Boolean(alternateAim),
    alive: player.hp > 0,
  });
  if (stats.weapon === "charge") {
    state.charging = autoFire;
    if (autoFire) {
      state.charge = Math.min(GameBalance.chargeLance.fullChargeSeconds, state.charge + dt);
      if (state.charge >= GameBalance.chargeLance.fullChargeSeconds) releaseCharge(false);
    }
  } else if (autoFire && player.fireCd <= 0) {
    fireWeapon(player, false, makeShotProfile(player.angle));
  }
  recordSnapshot();
  state.history.push({ t: state.elapsed, x: player.x, y: player.y });
  while (state.history.length && state.history[0].t < state.elapsed - 2.2) state.history.shift();
}
function makeShotProfile(angle, charge = 0) {
  const equipmentDamageMultiplier = stats.equipmentPlayerDamageMultiplier || 1;
  const p = EquipmentCore.buildFireProfile(
    {
      angle,
      damage: stats.playerDamage,
      echoBaseDamage: stats.playerDamage / equipmentDamageMultiplier,
      fireInterval: stats.fireRate,
      speed: BASE.BULLET_SPEED,
      range: BASE.BULLET_SPEED * 1.4,
      size: 3 * GameBalance.playerCombat.projectileSizeMultiplier,
      charge,
    },
    save.loadout,
    save.upgrades,
    EquipmentData
  );
  p.a = angle;
  return p;
}
function fireWeapon(owner, isEcho, profile, record = true) {
  const p = EquipmentCore.snapshotFireProfile({ ...profile, angle: profile.a ?? profile.angle });
  p.a = p.angle;
  owner.fireCd =
    p.fireInterval /
    (state.overdriveTimer > 0 ? GameBalance.overdrive.playerFireRateMultiplier : 1);
  owner.recoil = 1;
  if (state.playtestRun) {
    const field = isEcho ? "echoShots" : "playerShots";
    state.playtestRun = { ...state.playtestRun, [field]: state.playtestRun[field] + 1 };
  }
  for (let i = 0; i < p.count; i++) {
    const off = (i - (p.count - 1) / 2) * p.spread,
      a = p.a + off,
      c = Math.cos(a),
      s = Math.sin(a),
      damage = EquipmentCore.calculateProjectileDamage(p, {
        isEcho,
        echoRatio: stats.echoRatio,
        overdriveEchoMultiplier:
          state.overdriveTimer > 0 ? GameBalance.overdrive.echoDamageMultiplier : 1,
      });
    bullets.push({
      x: owner.x + c * 22,
      y: owner.y + s * 22,
      px: owner.x,
      py: owner.y,
      vx: c * p.speed,
      vy: s * p.speed,
      r: p.size,
      life: p.range / Math.max(1, p.speed),
      team: "player",
      echo: isEcho,
      timelineSource: isEcho ? `echo:${owner.i}` : "player",
      damage,
      pierce: p.pierce,
      coreDamageMultiplier: p.coreDamageMultiplier,
      visualProfile: { ...p.visualProfile },
      impactKind: CombatFeedback.isCriticalImpact(p, BASE.PLAYER_DAMAGE) ? "critical" : "normal",
      hitIds: [],
    });
  }
  if (!isEcho && record)
    state.current.events.push({
      t: state.elapsed,
      type: "shot",
      angle: p.a,
      weaponId: p.weaponId,
      profile: EquipmentCore.snapshotFireProfile(p),
    });
  (isEcho ? sfx.echo : sfx.shot)();
  burst(
    owner.x + Math.cos(p.a) * 22,
    owner.y + Math.sin(p.a) * 22,
    isEcho ? "#45f5e9" : p.visualProfile.color,
    5,
    100
  );
}
function releaseCharge(isEcho, owner = player, charge = state.charge, angle = owner.angle) {
  state.charging = false;
  if (charge < 0.08) return;
  fireWeapon(owner, isEcho, makeShotProfile(angle, charge));
  state.charge = 0;
}
function tryDash(p, record) {
  if (p.dashStock <= 0 || p.dashLeft > 0 || state.paused) return;
  let n = norm(p.vx, p.vy);
  if (Math.abs(p.vx) + Math.abs(p.vy) < 8) n = { x: Math.cos(p.angle), y: Math.sin(p.angle) };
  p.dashX = n.x;
  p.dashY = n.y;
  p.dashLeft = stats.dashTime;
  p.dashStock--;
  if (p.dashStock < stats.dashCharges && p.dashCd <= 0) p.dashCd = stats.dashCd;
  p.invuln = BASE.INVULN;
  if (record) state.current.events.push({ t: state.elapsed, type: "dash", x: n.x, y: n.y });
  sfx.dash();
  burst(p.x, p.y, "#ffb45d", 10, 130);
}
function hurtPlayer(raw, from) {
  if (player.invuln > 0) return;
  const dmg = raw * diff.damageTaken;
  const damageResult = EquipmentCore.applyShieldDamage(player.shield || 0, player.hp, dmg);
  if (damageResult.absorbed > 0) {
    player.shield = damageResult.shield;
    burst(player.x, player.y, "#66cfff", 12, 150);
    tone("sine", 620, 0.09, 0.035, -180);
  }
  const hpDamage = player.hp - damageResult.hp;
  if (hpDamage <= 0) {
    player.invuln = 0.2;
    return;
  }
  if (
    player.hp - hpDamage <= 0 &&
    stats.emergency &&
    !state.emergencyUsed &&
    state.history.length
  ) {
    const h = state.history[0];
    player.x = h.x;
    player.y = h.y;
    player.hp = Math.max(28, stats.maxHp * 0.3);
    player.invuln = 1;
    player.hurtAnim = 1;
    state.emergencyUsed = true;
    burst(player.x, player.y, "#45f5e9", 30, 240);
    tone("sine", 250, 0.5, 0.08, 700);
    return;
  }
  player.hp -= hpDamage;
  if (state.playtestRun)
    state.playtestRun = PlaytestCore.addDamageSource(
      state.playtestRun,
      damageSourceId(from),
      hpDamage
    );
  state.damageTaken += hpDamage;
  state.noHit = false;
  player.invuln = 0.45;
  player.hurtAnim = 1;
  shake = 12;
  flash = 0.22;
  hitStop = 0.04;
  sfx.hurt();
  burst(player.x, player.y, "#ff4f67", 18, 210);
  if (player.hp <= 0) {
    state.deathCause = damageSourceId(from);
    endLoop("death");
  }
}

// ── Echo 기록과 재생 ───────────────────────────────────────────────────────
function beginRecording() {
  state.current = {
    samples: [],
    events: [],
    alive: true,
    duration: 0,
    weapon: stats.weapon,
    weaponId: save.loadout.weapon,
  };
  state.nextSample = 0;
  recordSnapshot(true);
}
function recordSnapshot(force = false) {
  if (!EchoCore.shouldSample(state.elapsed, state.nextSample, force)) return;
  state.current.samples.push({ t: state.elapsed, x: player.x, y: player.y, a: player.angle });
  state.nextSample += BASE.SAMPLE;
}
function commitRecording(keep = true) {
  recordSnapshot(true);
  state.current.duration = state.elapsed;
  if (keep) {
    recordings = EchoCore.appendRecording(recordings, state.current, BASE.MAX_ECHOES);
  }
}
function makeEcho(rec, i) {
  const s = rec.samples[0];
  return {
    rec,
    i,
    x: s.x,
    y: s.y,
    angle: s.a,
    r: 14,
    eventIndex: 0,
    finished: false,
    extendedCd: 0,
    animTime: 0,
    motion: 0,
    recoil: 0,
    lastProfile: null,
    weaponId: rec.weaponId || null,
  };
}
function updateEchoes(dt) {
  for (const e of echoes) {
    const t = state.elapsed,
      extra = stats.memorySeconds;
    if (t > e.rec.duration + extra) {
      e.finished = true;
      continue;
    }
    e.finished = false;
    if (t <= e.rec.duration) {
      const oldX = e.x,
        oldY = e.y;
      const pose = EchoCore.interpolatePose(e.rec.samples, t);
      e.x = pose.x;
      e.y = pose.y;
      e.angle = pose.angle;
      e.motion = clamp(Math.hypot(e.x - oldX, e.y - oldY) / Math.max(dt * stats.speed, 1), 0, 1);
      e.animTime += dt * (2.5 + e.motion * 8);
      e.recoil = Math.max(0, e.recoil - dt * 9);
      const due = EchoCore.collectDueEvents(e.rec.events, e.eventIndex, t);
      e.eventIndex = due.nextIndex;
      for (const ev of due.events) {
        if (ev.type === "shot") {
          e.lastProfile = EquipmentCore.snapshotFireProfile({
            ...(ev.profile || {}),
            angle: ev.angle ?? ev.profile?.a ?? e.angle,
          });
          e.weaponId = e.lastProfile.weaponId;
          fireWeapon(e, true, e.lastProfile, false);
        } else if (ev.type === "dash") burst(e.x, e.y, "#45f5e9", 7, 80);
      }
    } else if (extra > 0) {
      e.extendedCd -= dt;
      if (e.extendedCd <= 0) {
        const supportProfile = e.lastProfile || makeShotProfile(e.angle);
        fireWeapon(e, true, { ...supportProfile, angle: e.angle, a: e.angle }, false);
        e.extendedCd = supportProfile.fireInterval || 0.22;
      }
    }
    if (Math.random() < 0.3) trail(e, "#45f5e9");
  }
}

// ── 총알, 적, Stage 3 구조선 ────────────────────────────────────────────────
function enemyStats(type) {
  const m = MonsterData[type] || MonsterData.chaser;
  return {
    r: m.radius,
    hp: GameBalance.scaledMonsterHp(m.hp, m.boss),
    speed: m.speed,
    score: m.score,
    behavior: m.behavior,
    boss: m.boss,
    elite: m.elite,
    stageGuardian: m.stageGuardian,
  };
}
function queueEnemies() {
  warnings = [];
  const world = activeWorld();
  if (world) {
    for (const zone of world.zones)
      warnings.push(
        ...WaveCore.expandZoneWaves(zone, {
          spawnDelayMultiplier: GameBalance.monsterTempo.spawnDelayMultiplier,
          bossSpawnDelayMultiplier: GameBalance.monsterTempo.bossSpawnDelayMultiplier,
          minimumSpawnInterval: GameBalance.monsterTempo.minimumSpawnInterval,
          minimumBossSpawnDelay: GameBalance.monsterTempo.minimumBossSpawnDelay,
          maximumBossSpawnDelay: GameBalance.monsterTempo.maximumBossSpawnDelay,
          isBoss: (type) => Boolean(MonsterData[type]?.boss),
        }).map((warning) => ({
          ...warning,
          targetShuttle: warning.targetShuttle || false,
        }))
      );
    return;
  }
  const encounter = currentEncounter();
  let source = encounter?.waves || stage.waves[0],
    count = encounter ? source.length : Math.ceil((3 + state.loop) * diff.enemyMix);
  for (let i = 0; i < count; i++) {
    const p = randomEdge(),
      type = source[i % source.length];
    const isBoss = Boolean(MonsterData[type]?.boss);
    warnings.push({
      ...p,
      type,
      timer: WaveCore.spawnDelayFor({
        baseDelay: 0.7,
        enemyIndex: i,
        isBoss,
        spawnDelayMultiplier: GameBalance.monsterTempo.spawnDelayMultiplier,
        bossSpawnDelayMultiplier: GameBalance.monsterTempo.bossSpawnDelayMultiplier,
        minimumSpawnInterval: GameBalance.monsterTempo.minimumSpawnInterval,
        minimumBossSpawnDelay: GameBalance.monsterTempo.minimumBossSpawnDelay,
        maximumBossSpawnDelay: GameBalance.monsterTempo.maximumBossSpawnDelay,
      }),
      targetShuttle: stage.number === 3 && i % 3 === 0,
    });
  }
}
function spawnEnemy(w) {
  const q = enemyStats(w.type);
  const bossConfig = BossData[w.type] || null;
  const corruptZone =
    q.behavior === "corrupted-replay" ? WorldCore.zoneAt(activeWorld()?.zones || [], w) : null;
  const corruptOrder = q.behavior === "corrupted-replay" ? corruptedSpawnSequence++ : 0;
  const firstBossPoint =
    bossConfig?.movement?.points?.[0] || bossConfig?.movement?.phasePoints?.[0]?.[0];
  enemies.push({
    ...w,
    r: q.r,
    hp: q.hp,
    maxHp: q.hp,
    speed: q.speed,
    score: q.score,
    behavior: q.behavior,
    boss: q.boss,
    elite: w.elite || q.elite,
    stageGuardian: q.stageGuardian,
    bossConfig,
    bossState: {},
    bossPhase: 1,
    bossAttackIndex: 0,
    bossPattern: "radial",
    bossAim: 0,
    bossDash: 0,
    bossSpawnElapsed: state.elapsed,
    bossMovementPhaseStarted: state.elapsed,
    bossMovementPaused: 0,
    bossMovementOrigin: bossConfig
      ? { x: w.x - (firstBossPoint?.x || 0), y: w.y - (firstBossPoint?.y || 0) }
      : null,
    bossMovePose: null,
    bossMoveFacing: 0,
    synergyState: {},
    attackTimer: 1.4,
    telegraph: 0,
    alive: true,
    fire: 1 + Math.random(),
    touch: 0,
    wobble: Math.random() * 6.28,
    hitFlash: 0,
    hurt: 0,
    stun: 0,
    corruptCursor: 0,
    corruptOrigin: q.behavior === "corrupted-replay" ? { x: w.x, y: w.y } : null,
    corruptBounds: corruptZone
      ? { x: corruptZone.x, y: corruptZone.y, w: corruptZone.w, h: corruptZone.h }
      : null,
    corruptOrder,
    corruptTransform: null,
    corruptPending: [],
    moveFacing: 0,
  });
}
function enemyShoot(e, target) {
  const n = norm(target.x - e.x, target.y - e.y);
  bullets.push({
    x: e.x + n.x * 20,
    y: e.y + n.y * 20,
    px: e.x,
    py: e.y,
    vx: n.x * 230 * diff.enemyBullet,
    vy: n.y * 230 * diff.enemyBullet,
    r: 6,
    life: 4,
    team: "enemy",
    sourceType: e.type,
    damage: 12,
    targetShuttle: e.targetShuttle,
  });
}
function corruptedEchoShoot(e, angle) {
  const speed = CorruptedEchoCore.CONFIG.projectileSpeed * diff.enemyBullet;
  bullets.push({
    x: e.x + Math.cos(angle) * 20,
    y: e.y + Math.sin(angle) * 20,
    px: e.x,
    py: e.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: 5,
    life: 3.2,
    team: "enemy",
    sourceType: "corrupted-echo",
    damage: CorruptedEchoCore.CONFIG.projectileDamage,
  });
  e.telegraph = 0.08;
  burst(e.x, e.y, "#c94d72", 5, 70);
}
function bossProjectile(e, angle, profile, speedMultiplier = 1) {
  bullets.push({
    x: e.x + Math.cos(angle) * (e.r + 8),
    y: e.y + Math.sin(angle) * (e.r + 8),
    px: e.x,
    py: e.y,
    vx: Math.cos(angle) * profile.projectileSpeed * speedMultiplier * diff.enemyBullet,
    vy: Math.sin(angle) * profile.projectileSpeed * speedMultiplier * diff.enemyBullet,
    r: e.bossPhase >= 3 ? 8 : e.bossPhase === 2 ? 7 : 6,
    life: 4,
    team: "enemy",
    sourceType: e.type,
    damage: profile.projectileDamage,
  });
}
function bossFan(e, profile, angle, count = profile.projectileCount, spread = Math.PI / 3) {
  for (let i = 0; i < count; i++) {
    const offset = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
    bossProjectile(e, angle + offset, profile);
  }
}
function bossVolley(e) {
  const profile = BossCore.attackProfile(e.bossConfig, e.bossPhase);
  const pattern = e.bossPattern || "radial";
  if (["fan", "pursuit-fan", "echo-fan"].includes(pattern)) {
    bossFan(e, profile, e.bossAim, profile.projectileCount, pattern === "fan" ? 0.58 : 0.82);
  } else if (pattern === "charge") {
    bossFan(e, profile, e.bossAim, 3, 0.16);
  } else if (pattern === "barrier-lines") {
    for (const lane of [-2, -1, 0, 1, 2])
      bossProjectile(e, e.bossAim + lane * 0.12, profile, lane === 0 ? 0.78 : 1);
  } else if (pattern === "corrupt-summon") {
    if (enemies.filter((enemy) => enemy.alive && enemy.type === "corrupted-echo").length < 3)
      for (const side of [-1, 1])
        warnings.push({
          x: clamp(e.x + side * 150, 70, worldSize().width - 70),
          y: clamp(e.y + side * 110, 70, worldSize().height - 70),
          type: "corrupted-echo",
          timer: 0.7,
          armed: true,
          elite: true,
        });
  } else if (pattern === "memory-volley") {
    const targets = [player, ...echoes.filter((echo) => !echo.finished)].slice(0, 4);
    for (const target of targets)
      bossFan(e, profile, Math.atan2(target.y - e.y, target.x - e.x), 3, 0.22);
  } else {
    const safeAngle = e.bossAim;
    for (let i = 0; i < profile.projectileCount; i++) {
      const angle = (i / profile.projectileCount) * Math.PI * 2 + e.wobble * 0.2;
      const safeDelta = Math.abs(
        Math.atan2(Math.sin(angle - safeAngle), Math.cos(angle - safeAngle))
      );
      if (pattern === "safe-sector" && safeDelta < 0.42) continue;
      bossProjectile(e, angle, profile, pattern === "rift-ring" ? 0.82 : 1);
    }
  }
  burst(e.x, e.y, "#c96b7a", 18, 150);
  tone("sawtooth", e.bossPhase >= 3 ? 82 : e.bossPhase === 2 ? 105 : 135, 0.22, 0.055, -35);
}
function updateBossMovement(e, dt) {
  if (!e.bossConfig?.movement || !e.bossMovementOrigin) return;
  const barrierOpen = BossCore.shieldOpen(e.bossState, state.elapsed);
  if (barrierOpen) e.bossMovementPaused += dt;
  const movementElapsed = Math.max(
    0,
    state.elapsed - e.bossMovementPhaseStarted - e.bossMovementPaused
  );
  const pose = BossCore.movementPose(e.bossConfig, movementElapsed, e.bossPhase);
  if (!pose) return;
  const nextX = e.bossMovementOrigin.x + pose.x;
  const nextY = e.bossMovementOrigin.y + pose.y;
  const moveX = nextX - e.x;
  const moveY = nextY - e.y;
  if (pose.moving && Math.hypot(moveX, moveY) > 0.01) {
    e.bossMoveFacing = Math.atan2(moveY, moveX);
  }
  e.bossMovePose = {
    ...pose,
    targetX: e.bossMovementOrigin.x + pose.target.x,
    targetY: e.bossMovementOrigin.y + pose.target.y,
  };
  e.x = nextX;
  e.y = nextY;
  e.vx = 0;
  e.vy = 0;
}
function updateEnemies(dt) {
  for (const e of enemies) {
    if (!e.alive) continue;
    e.touch -= dt;
    e.fire -= dt;
    e.wobble += dt;
    e.hitFlash = Math.max(0, e.hitFlash - dt);
    e.hurt = Math.max(0, e.hurt - dt * 8);
    if (e.stun > 0) {
      e.stun -= dt;
      if (e.bossConfig) updateBossMovement(e, dt);
      continue;
    }
    if (e.behavior === "corrupted-replay") {
      for (let index = e.corruptPending.length - 1; index >= 0; index--) {
        const pending = e.corruptPending[index];
        pending.timer -= dt;
        if (pending.timer <= 0) {
          corruptedEchoShoot(e, pending.angle);
          e.corruptPending.splice(index, 1);
        }
      }
      const completed = recordings.length > 0;
      const recording = completed ? recordings[recordings.length - 1] : state.current;
      const playback = CorruptedEchoCore.playbackTime(state.elapsed, completed);
      const pose = CorruptedEchoCore.samplePose(recording?.samples, playback);
      if (pose) {
        const oldX = e.x;
        const oldY = e.y;
        e.corruptTransform ||= CorruptedEchoCore.createLocalReplayTransform(
          recording.samples,
          e.corruptOrigin,
          e.corruptBounds,
          e.corruptOrder,
          e.r + CorruptedEchoCore.CONFIG.pathPadding
        );
        const replayTarget = CorruptedEchoCore.localReplayTarget(pose, e.corruptTransform);
        const size = worldSize();
        const clearTarget = CollisionCore.nearestOpenPoint(
          replayTarget,
          walls,
          {
            minX: 42,
            maxX: size.width - 42,
            minY: 55,
            maxY: size.height - 42,
          },
          e.r
        );
        const step = CorruptedEchoCore.movementStep(e, clearTarget, dt);
        moveActor(e, step.x, step.y);
        e.vx = dt > 0 ? (e.x - oldX) / dt : 0;
        e.vy = dt > 0 ? (e.y - oldY) / dt : 0;
        if (Math.hypot(e.vx, e.vy) > 1) e.moveFacing = Math.atan2(e.vy, e.vx);
        e.angle = pose.angle;
        e.wobble += Math.hypot(e.x - oldX, e.y - oldY) * 0.012;
        const due = CorruptedEchoCore.collectShots(recording.events, e.corruptCursor, playback);
        e.corruptCursor = due.nextIndex;
        for (const shot of due.shots)
          e.corruptPending.push({
            angle: shot.angle ?? shot.profile?.angle ?? pose.angle,
            timer: CorruptedEchoCore.CONFIG.telegraphSeconds,
          });
      }
      continue;
    }
    if (e.bossConfig) {
      const phase = BossCore.phaseFor(e.hp, e.maxHp, e.bossConfig);
      if (phase !== e.bossPhase) {
        e.bossPhase = phase;
        e.bossAttackIndex = 0;
        const phaseFirstPoint = e.bossConfig.movement?.phasePoints?.[Math.max(0, phase - 1)]?.[0] ||
          e.bossConfig.movement?.points?.[0] || { x: 0, y: 0 };
        e.bossMovementOrigin = {
          x: e.x - phaseFirstPoint.x,
          y: e.y - phaseFirstPoint.y,
        };
        e.bossMovementPhaseStarted = state.elapsed;
        e.bossMovementPaused = 0;
        if (e.type === "chrono-abomination" && phase === 2) {
          bullets = bullets.filter((bullet) => bullet.team === "player");
          burst(e.x, e.y, "#c94d72", 36, 260);
        }
        timeWarp = 0.45;
        shake = 8;
        playCue("bossPhase");
        combatText(e.x, e.y - e.r - 18, "패턴 변화", "#f0b76b", true);
      }
      e.attackTimer -= dt;
      if (e.telegraph > 0) {
        e.telegraph -= dt;
        if (e.telegraph <= 0) bossVolley(e);
      } else if (e.attackTimer <= 0) {
        const profile = BossCore.attackProfile(e.bossConfig, e.bossPhase);
        e.bossPattern = BossCore.patternFor(e.bossConfig, e.bossPhase, e.bossAttackIndex++);
        const echoTarget = echoes.find((echo) => !echo.finished);
        const target = e.bossPattern === "echo-fan" && echoTarget ? echoTarget : player;
        e.bossAim =
          e.bossPattern === "safe-sector"
            ? e.wobble + Math.PI
            : Math.atan2(target.y - e.y, target.x - e.x);
        e.telegraph = profile.telegraphSeconds;
        e.attackTimer = profile.cooldown + profile.telegraphSeconds;
      }
      updateBossMovement(e, dt);
      if (hit(e, player) && e.touch <= 0) {
        hurtPlayer(10, e);
        e.touch = 0.7;
      }
      continue;
    }
    const target = e.targetShuttle && shuttle && shuttle.hp > 0 ? shuttle : player;
    let tx = target.x,
      ty = target.y;
    if (e.behavior === "shoot") {
      const d = Math.hypot(target.x - e.x, target.y - e.y),
        dir = d < 245 ? -1 : d > 360 ? 1 : 0;
      tx = e.x + (target.x - e.x) * dir;
      ty = e.y + (target.y - e.y) * dir + Math.sin(e.wobble) * 40;
      if (e.fire <= 0 && d < 540) {
        enemyShoot(e, target);
        e.fire = 1.65;
      }
    }
    if (e.behavior === "guard-relay") {
      const r = MonsterData.selectGuardTarget(relays, core, e);
      const n = norm(player.x - r.x, player.y - r.y);
      tx = r.x + n.x * 48;
      ty = r.y + n.y * 48;
    }
    if (e.behavior === "guard-core") {
      const targetDevice = relays.find((relay) => !relay.active) || core;
      const n = norm(player.x - targetDevice.x, player.y - targetDevice.y);
      tx = targetDevice.x + n.x * 58;
      ty = targetDevice.y + n.y * 58;
    }
    if (["pursue", "leech", "explode"].includes(e.behavior)) {
      tx += Math.sin(e.wobble) * 32;
      ty += Math.cos(e.wobble * 0.8) * 32;
    }
    const n = norm(tx - e.x, ty - e.y);
    e.vx = n.x * e.speed;
    e.vy = n.y * e.speed;
    moveActor(e, e.vx * dt, e.vy * dt);
    if (target === player && hit(e, player) && e.touch <= 0) {
      hurtPlayer(e.behavior === "guard-relay" || e.behavior === "guard-core" ? 16 : 10, e);
      if (e.behavior === "leech") state.slowTimer = Math.max(state.slowTimer, 2.2);
      e.touch = 0.7;
    } else if (target === shuttle && hit(e, shuttle) && e.touch <= 0) {
      hurtShuttle(e.type === "blocker" ? 18 : 11, e);
      e.touch = 0.8;
    }
  }
}
function updateBullets(dt) {
  const size = worldSize();
  const objective = activeObjective();
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.px = b.x;
    b.py = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    let gone = b.life <= 0 || b.x < 0 || b.x > size.width || b.y < 0 || b.y > size.height;
    if (
      !gone &&
      walls.some((w) => !w.open && b.x > w.x && b.x < w.x + w.w && b.y > w.y && b.y < w.y + w.h)
    ) {
      spark(b.x, b.y, "#659cff");
      gone = true;
    }
    if (!gone && b.team === "enemy") {
      if (b.targetShuttle && shuttle && shuttle.hp > 0 && hit(b, shuttle)) {
        hurtShuttle(b.damage, b);
        gone = true;
      } else if (hit(b, player)) {
        hurtPlayer(b.damage, b);
        gone = true;
      }
    }
    if (!gone && b.team === "player") {
      for (const e of enemies)
        if (e.alive && !b.hitIds?.includes(e) && playerProjectileHitsEnemy(b, e)) {
          b.hitIds?.push(e);
          damageEnemy(e, b.damage, b.echo, b);
          const impact = EquipmentCore.resolveProjectileImpact(b.pierce, "enemy");
          b.pierce = impact.pierce;
          gone = impact.removed;
          break;
        }
      if (!gone)
        for (const s of switches)
          if (!b.hitIds?.includes(s) && hit(b, s)) {
            b.hitIds?.push(s);
            s.charge = Math.min(100, s.charge + (s.gain || 16));
            s.lastHit = state.elapsed;
            const source = b.timelineSource || (b.echo ? "echo:legacy" : "player");
            s.hitSources ||= [];
            if (!s.hitSources.includes(source)) s.hitSources.push(source);
            const impact = EquipmentCore.resolveProjectileImpact(b.pierce, "relay");
            b.pierce = impact.pierce;
            gone = impact.removed;
            break;
          }
      if (!gone)
        for (const r of relays)
          if (!b.hitIds?.includes(r) && hit(b, r)) {
            b.hitIds?.push(r);
            const progress = ObjectiveData.registerRelayHit(objective, r.hits);
            r.hits = progress.hits;
            r.charge = progress.charge;
            r.lastHit = state.elapsed;
            const impact = EquipmentCore.resolveProjectileImpact(b.pierce, "relay");
            b.pierce = impact.pierce;
            gone = impact.removed;
            break;
          }
      if (!gone && anchorActive() && hit(b, core)) {
        const guardianPending =
          enemies.some((enemy) => enemy.alive && enemy.stageGuardian) ||
          warnings.some((warning) => MonsterData[warning.type]?.stageGuardian);
        if (state.shieldTimer > 0 && !guardianPending) {
          damageCore(b.damage * (b.coreDamageMultiplier || 1), b.echo);
          burst(b.x, b.y, "#fff", 6, 85);
        } else {
          spark(b.x, b.y, "#69a6ff");
          if (guardianPending) combatText(core.x, core.y - core.r - 14, "보스 보호막", "#ff9aaa");
        }
        gone = true;
      }
    }
    if (gone) bullets.splice(i, 1);
  }
}
function combatText(x, y, text, color, strong = false) {
  particles.push({
    x,
    y,
    vx: 0,
    vy: strong ? -34 : -24,
    life: strong ? 0.62 : 0.42,
    max: strong ? 0.62 : 0.42,
    color,
    size: strong ? 13 : 10,
    text,
  });
}
function damageEnemy(e, dmg, byEcho, impact = null, skipSynergy = false) {
  const critical = impact?.impactKind === "critical";
  if (e.bossConfig && !BossCore.shieldOpen(e.bossState, state.elapsed)) {
    const sync = BossCore.registerShieldHit(e.bossState, byEcho, state.elapsed, e.bossConfig);
    e.bossState = sync.state;
    spark(e.x, e.y, byEcho ? "#45f5e9" : "#ffe0a6");
    if (sync.opened) {
      combatText(e.x, e.y - e.r - 18, "시간 방벽 붕괴", "#73c9bf", true);
      timeWarp = 0.42;
      shake = Math.max(shake, 7);
      burst(e.x, e.y, "#73c9bf", 24, 220);
      playCue("barrier");
    } else return;
  }
  if (!skipSynergy) {
    const synergy = SynergyCore.registerHit(e.synergyState, byEcho, state.elapsed);
    e.synergyState = synergy.state;
    if (synergy.crossfire) {
      dmg += SynergyCore.config.crossfireBonusDamage;
      combatText(e.x, e.y - e.r - 16, "교차 사격", "#73c9bf", true);
      burst(e.x, e.y, "#73c9bf", 12, 175);
    }
  }
  e.hp -= dmg;
  e.hitFlash = critical ? 0.14 : 0.09;
  e.hurt = 1;
  const reaction = CombatFeedback.impactReaction(critical);
  e.stun = Math.max(e.stun || 0, reaction.stun);
  if (impact && !e.bossConfig) {
    const direction = norm(impact.vx || 0, impact.vy || 0);
    moveActor(e, direction.x * reaction.knockback, direction.y * reaction.knockback);
  }
  sfx.enemyHit(critical);
  burst(e.x, e.y, critical ? "#ffe0a6" : "#ff3f63", critical ? 10 : 5, critical ? 160 : 100);
  if (critical) {
    hitStop = Math.max(hitStop, 0.025);
    shake = Math.max(shake, 3);
    combatText(e.x, e.y - e.r - 10, "치명타", "#ffe0a6", true);
  }
  if (e.hp <= 0) {
    e.alive = false;
    state.kills++;
    state.combo = state.elapsed - state.lastKill < 2.2 ? state.combo + 1 : 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.score += e.score + state.combo * 20;
    if (byEcho) state.echoDamage += e.maxHp;
    state.lastKill = state.elapsed;
    const elite = CombatFeedback.isElite(e);
    const chain = SynergyCore.registerKill(state.synergyKillState, byEcho, state.elapsed);
    state.synergyKillState = chain.state;
    sfx.kill(elite);
    hitStop = Math.max(hitStop, elite ? 0.07 : 0.035);
    if (elite) shake = Math.max(shake, 8);
    burst(e.x, e.y, elite ? "#f0b76b" : "#ff4c70", elite ? 30 : 18, elite ? 260 : 200);
    if (e.type === "rift-warden") {
      combatText(e.x, e.y - e.r - 18, "RIFT WARDEN 격파", "#73c9bf", true);
      timeWarp = Math.max(timeWarp, 0.65);
      shake = Math.max(shake, 12);
      burst(e.x, e.y, "#73c9bf", 42, 300);
    } else if (elite) combatText(e.x, e.y - e.r - 14, "정예 처치", "#f0b76b", true);
    else if (state.combo >= CombatFeedback.config.comboFeedbackThreshold)
      combatText(
        e.x,
        e.y - e.r - 10,
        `${state.combo} 연속`,
        "#d7d0bd",
        state.combo >= CombatFeedback.config.strongComboThreshold
      );
    if (chain.chain) {
      combatText(e.x, e.y - e.r - 24, "시간 연쇄", "#73c9bf", true);
      burst(e.x, e.y, "#73c9bf", 22, 220);
      for (const target of enemies)
        if (
          target !== e &&
          target.alive &&
          Math.hypot(target.x - e.x, target.y - e.y) <= SynergyCore.config.chainRadius
        )
          damageEnemy(target, SynergyCore.config.chainDamage, byEcho, null, true);
    }
    monsterRemains(e);
    dropShard(e);
    if (e.behavior === "explode")
      explosions.push({ x: e.x, y: e.y, r: 82, timer: 0.65, exploded: false });
  }
}
function dropShard(enemy) {
  const monster = MonsterData[enemy.type] || MonsterData.chaser;
  pickups.push({
    x: enemy.x,
    y: enemy.y,
    value: monster.reward,
    life: GameBalance.overdrive.pickupLife,
    phase: Math.random() * 6.283,
  });
}
function collectPickup(pickup) {
  const next = TemporalCore.collectShard(state, pickup.value, GameBalance.overdrive);
  const activated = state.overdriveTimer <= 0 && next.overdriveTimer > 0;
  state.overdriveGauge = next.overdriveGauge;
  state.overdriveTimer = next.overdriveTimer;
  state.score += pickup.value * 15;
  burst(pickup.x, pickup.y, "#72fff0", 9, 120);
  if (activated) {
    tone("sawtooth", 210, 0.6, 0.08, 760);
    shake = 7;
    timeWarp = 0.7;
  }
}
function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const pickup = pickups[i];
    pickup.life -= dt;
    pickup.phase += dt * 5;
    const d = Math.hypot(player.x - pickup.x, player.y - pickup.y);
    if (d < stats.shardRadius) {
      const n = norm(player.x - pickup.x, player.y - pickup.y);
      const speed = 90 + (stats.shardRadius - d) * 4;
      pickup.x += n.x * speed * dt;
      pickup.y += n.y * speed * dt;
    }
    if (d < player.r + 9) {
      collectPickup(pickup);
      pickups.splice(i, 1);
    } else if (pickup.life <= 0) pickups.splice(i, 1);
  }
}
function updateExplosions(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const blast = explosions[i];
    blast.timer -= dt;
    if (blast.timer <= 0 && !blast.exploded) {
      blast.exploded = true;
      if (Math.hypot(player.x - blast.x, player.y - blast.y) < blast.r) hurtPlayer(18, blast);
      for (const enemy of enemies)
        if (enemy.alive && Math.hypot(enemy.x - blast.x, enemy.y - blast.y) < blast.r)
          damageEnemy(enemy, 28, false);
      burst(blast.x, blast.y, "#ff9a45", 34, 260);
      shake = 9;
    }
    if (blast.timer < -0.2) explosions.splice(i, 1);
  }
}
function monsterRemains(e) {
  const m = MonsterData[e.type] || MonsterData.chaser;
  for (let i = 0; i < (e.type === "blocker" ? 8 : 5); i++) {
    const a = Math.random() * 6.283;
    particles.push({
      x: e.x,
      y: e.y,
      vx: Math.cos(a) * (50 + Math.random() * 130),
      vy: Math.sin(a) * (50 + Math.random() * 130),
      life: 0.35 + Math.random() * 0.3,
      max: 0.65,
      color: m.color,
      size: 3 + Math.random() * 4,
      shard: true,
    });
  }
}
function hurtShuttle(dmg, source) {
  if (!shuttle || shuttle.hp <= 0) return;
  const rules = activeWorld()?.escortRules;
  shuttle.hp = Math.max(0, shuttle.hp - dmg);
  if (shuttle.hp <= 0 && rules?.destruction?.[diff.id] === "last-survivor") {
    shuttle.hp = shuttle.maxHp / rules.totalSurvivors;
    combatText(shuttle.x, shuttle.y - shuttle.r - 16, "최후 생존자 보호", "#79dcff", true);
  }
  state.shuttleHp = shuttle.hp;
  shuttle.survivors = Math.ceil(((rules?.totalSurvivors || 12) * shuttle.hp) / shuttle.maxHp);
  state.shuttleAlert = rules?.warningSeconds || 1.2;
  state.shuttleThreatAngle = source ? Math.atan2(source.y - shuttle.y, source.x - shuttle.x) : 0;
  if (state.shuttleAlertSound <= 0) {
    tone("square", 105, 0.16, 0.055, 55);
    state.shuttleAlertSound = rules?.warningSoundCooldown || 0.55;
  }
  shake = 5;
  burst(shuttle.x, shuttle.y, "#79dcff", 10, 130);
  if (shuttle.hp <= 0) {
    state.failureReason = "구조선 파괴";
    endStage(false);
  }
}

// ── 릴레이, 장벽, Chrono Anchor ────────────────────────────────────────────
function makeObjectives() {
  const objective = activeObjective(),
    hp = core?.hp ?? stage.difficulty.coreHp,
    c = {
      x: objective.core.x,
      y: objective.core.y,
      r: 46,
      hp,
      maxHp: stage.difficulty.coreHp,
    };
  return {
    c,
    rs: (!anchorActive() ? [] : objective.relayPositions.slice(0, objective.relayCount)).map(
      (p, i) => ({
        x: p.x,
        y: p.y,
        baseX: p.x,
        baseY: p.y,
        r: 30,
        charge: 0,
        hits: 0,
        active: false,
        lastHit: -9,
        index: i,
        moving: i === objective.movingRelayIndex,
      })
    ),
  };
}
function buildArena() {
  const world = activeWorld();
  if (world) {
    rooms = world.zones.map((zone) => ({ ...zone }));
    walls = [
      ...world.walls.map((wall) => ({ ...wall, open: false })),
      ...(world.progressionGates || []).map((gate) => ({
        ...gate,
        open: false,
        progressionGate: true,
      })),
    ];
    switches = world.switches.map((item) => ({
      ...item,
      charge: 0,
      lastHit: -9,
      hitSources: [],
    }));
    shuttle = world.shuttle
      ? {
          ...world.shuttle,
          r: 38,
          hp: state.shuttleHp,
          maxHp: world.shuttle.hp,
          survivors: Math.ceil((world.shuttle.survivors * state.shuttleHp) / world.shuttle.hp),
        }
      : null;
    state.hazardCooldowns = {};
    return;
  }
  const layout = RoomData[stage.id];
  const encounter = currentEncounter();
  rooms = encounter
    ? [{ id: encounter.id, name: encounter.name, x: 35, y: 45, w: 1210, h: 630 }]
    : layout
      ? layout.rooms.map((room) => ({ ...room }))
      : [];
  walls = (encounter?.walls || layout?.walls || []).map((wall) => ({ ...wall, open: false }));
  switches = [];
  shuttle = null;
  if (stage.number === 2) {
    switches = [{ x: 410, y: 210, r: 31, charge: 0, lastHit: -9 }];
  }
  if (stage.number === 3)
    shuttle = {
      x: 640,
      y: 600,
      r: 38,
      hp: state.shuttleHp,
      maxHp: 260,
      survivors: Math.ceil((12 * state.shuttleHp) / 260),
    };
}
function updateWorldHazards(dt) {
  const hazards = activeWorld()?.hazards || [];
  for (const hazard of hazards) {
    state.hazardCooldowns[hazard.id] = Math.max(0, (state.hazardCooldowns[hazard.id] || 0) - dt);
    const inside =
      player.x + player.r > hazard.x &&
      player.x - player.r < hazard.x + hazard.w &&
      player.y + player.r > hazard.y &&
      player.y - player.r < hazard.y + hazard.h;
    if (inside && state.hazardCooldowns[hazard.id] <= 0) {
      hurtPlayer(hazard.damage, { sourceType: "rift-floor" });
      state.hazardCooldowns[hazard.id] = hazard.interval;
      burst(player.x, player.y, "#9b456d", 10, 120);
    }
  }
}
function updateObjectives(dt) {
  const objective = activeObjective();
  for (const s of switches) {
    if (state.elapsed - s.lastHit > 0.18) {
      s.charge = Math.max(0, s.charge - (s.decay || 13) * diff.relayDecay * dt);
      if (s.charge <= 0) s.hitSources = [];
    }
    const gate = s.gateId ? walls.find((w) => w.id === s.gateId) : walls.find((w) => w.gate);
    if (gate) gate.open = s.charge >= (s.threshold || 42);
  }
  for (const r of relays) {
    if (r.moving) {
      r.x = r.baseX + Math.sin(state.elapsed * 0.75) * 90;
      r.y = r.baseY + Math.sin(state.elapsed * 1.5) * 28;
    }
    const was = r.active;
    r.active = (r.hits || 0) >= (objective.relayHitsToActivate || 7);
    if (r.active && !was) {
      state.score += 250;
      sfx.relay();
      burst(r.x, r.y, "#b88cff", 20, 140);
      timeWarp = Math.max(timeWarp, 0.28);
    }
  }
  if (
    relays.length > 0 &&
    relays.filter((r) => r.active).length >= objective.requiredRelays &&
    state.shieldTimer <= 0
  ) {
    state.shieldTimer = objective.shieldOpenSeconds * (diff.shieldTime / BASE.SHIELD_OPEN);
    state.score += 500 + echoes.length * 100;
    sfx.shield();
    shake = 9;
    timeWarp = 0.45;
  }
  state.shieldTimer = Math.max(0, state.shieldTimer - dt);
}
function updateZoneProgression(dt) {
  const world = activeWorld();
  if (!world) return;
  const currentZone = WorldCore.zoneAt(world.zones, player);
  const previous = state.zoneProgress;
  const next = ZoneObjectiveCore.tick(
    previous,
    world,
    {
      currentZoneId: currentZone?.id,
      difficultyId: diff.id,
      enemies,
      warnings,
      switches,
      shuttle,
      escortRules: world.escortRules,
      player,
      core,
      monsters: MonsterData,
    },
    dt
  );
  for (const gateConfig of world.progressionGates || []) {
    const gate = walls.find((wall) => wall.id === gateConfig.id && wall.progressionGate);
    const wasComplete = previous[gateConfig.zoneId]?.complete;
    const isComplete = next[gateConfig.zoneId]?.complete;
    if (gate) gate.open = Boolean(isComplete);
    if (!wasComplete && isComplete) {
      const zone = world.zones.find((item) => item.id === gateConfig.zoneId);
      state.score += gateConfig.rewardScore || (zone?.objective === "elite" ? 600 : 200);
      shake = Math.max(shake, zone?.objective === "elite" ? 10 : 5);
      timeWarp = Math.max(timeWarp, zone?.objective === "elite" ? 0.5 : 0.25);
      burst(gateConfig.x, gateConfig.y + gateConfig.h / 2, "#45f5e9", 18, 170);
      combatText(
        gateConfig.x - 30,
        gateConfig.y + gateConfig.h / 2,
        gateConfig.unlockLabel || "봉쇄 해제",
        "#73c9bf",
        true
      );
      playCue("barrier");
    }
  }
  state.zoneProgress = next;
}
function damageCore(dmg, byEcho) {
  if (state.collapsing) return;
  const applied =
    dmg * (state.overdriveTimer > 0 ? GameBalance.overdrive.anchorDamageMultiplier : 1);
  core.hp = Math.max(0, core.hp - applied);
  state.coreDamage += applied;
  state.totalCoreHits++;
  if (byEcho) {
    state.lastEchoCoreHit = state.elapsed;
    state.echoCoreHits++;
    state.echoDamage += applied;
  } else state.lastPlayerCoreHit = state.elapsed;
  state.score += Math.round(applied * 5);
  shake = 3;
  tryTemporalOverload();
  updateAnchorPhase();
  if (core.hp <= 0) collapseAnchor();
}
function tryTemporalOverload() {
  if (
    !TemporalCore.canTemporalOverload(
      {
        now: state.elapsed,
        playerHitAt: state.lastPlayerCoreHit,
        echoHitAt: state.lastEchoCoreHit,
        lastOverloadAt: state.lastOverload,
        shieldOpen: state.shieldTimer > 0,
      },
      { ...GameBalance.overload, cooldown: stats.overloadCooldown }
    )
  )
    return;
  const bonus =
    GameBalance.overload.bonusDamage *
    stats.overloadDamageMultiplier *
    (state.overdriveTimer > 0 ? GameBalance.overload.overdriveBonus : 1) *
    SynergyCore.convergenceMultiplier(echoes.length);
  core.hp = Math.max(0, core.hp - bonus);
  state.coreDamage += bonus;
  state.lastOverload = state.elapsed;
  state.overloads++;
  state.overloadText = 0.8;
  state.overloadLabel =
    echoes.length >= SynergyCore.config.convergenceEchoes ? "ECHO 수렴" : "시간 과부하";
  state.score += bonus * 8;
  hitStop = 0.055;
  shake = 8;
  burst(core.x, core.y, "#c9fff8", 24, 210);
  tone("square", 260, 0.22, 0.07, 520);
}
function updateAnchorPhase() {
  const phase = TemporalCore.anchorPhase(core.hp / core.maxHp, GameBalance.anchorPhases);
  if (phase === state.anchorPhase) return;
  state.anchorPhase = phase;
  if (phase !== "collapsed") {
    burst(core.x, core.y, phase === "critical" ? "#ffdf70" : "#ff5570", 26, 230);
    tone("sawtooth", phase === "critical" ? 120 : 190, 0.32, 0.07, -60);
    shake = phase === "critical" ? 12 : 7;
    timeWarp = phase === "critical" ? 0.58 : 0.35;
  }
}
function collapseAnchor() {
  if (state.mode === "result" || state.collapsing) return;
  state.collapsing = true;
  state.anchorPhase = "collapsed";
  hitStop = 0.12;
  shake = 18;
  timeWarp = 0.9;
  echoes.forEach((echo) => (echo.finished = true));
  for (let i = 0; i < 4; i++)
    setTimeout(() => burst(core.x, core.y, i % 2 ? "#fff" : "#ff315b", 28, 260 + i * 40), i * 55);
  setTimeout(() => endStage(true), 180);
}

// ── 파티클과 진행 ──────────────────────────────────────────────────────────
function burst(x, y, color, count, speed) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * 6.283,
      s = speed * (0.25 + Math.random() * 0.75);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 0.18 + Math.random() * 0.28,
      max: 0.46,
      color,
      size: 1 + Math.random() * 3,
    });
  }
}
function spark(x, y, color) {
  burst(x, y, color, 8, 140);
}
function trail(o, color) {
  particles.push({
    x: o.x,
    y: o.y,
    vx: 0,
    vy: 0,
    life: 0.16,
    max: 0.16,
    color,
    size: o.r * 0.75,
    ghost: true,
  });
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.94;
    p.vy *= 0.94;
    if (p.life <= 0) particles.splice(i, 1);
  }
}
function resetLoopWorld() {
  player = makePlayer();
  state.shieldRefresh = false;
  bullets = [];
  particles = [];
  pickups = [];
  explosions = [];
  enemies = [];
  corruptedSpawnSequence = 0;
  const o = makeObjectives();
  core = o.c;
  relays = o.rs;
  buildArena();
  state.zoneProgress = activeWorld() ? ZoneObjectiveCore.createProgress(activeWorld()) : {};
  updateCameraTracking(0, true);
  state.elapsed = 0;
  state.shieldTimer = 0;
  state.noHit = true;
  state.ending = false;
  state.history = [];
  state.charging = false;
  state.charge = 0;
  echoes = recordings.map(makeEcho);
  queueEnemies();
  beginRecording();
  updateHUD();
}
function currentEncounter() {
  return !activeWorld() && stage?.number === 1
    ? RoomData.awakening.encounters[state.roomIndex]
    : null;
}
function anchorActive() {
  if (activeWorld()) return true;
  const encounter = currentEncounter();
  return !encounter || encounter.objective === "anchor";
}
function enterNextRoom() {
  if (state.mode !== "playing") return;
  const transition = RoomData.beginRoomTransition(state);
  state.mode = transition.mode;
  state.roomTransition = transition.roomTransition;
  state.charging = false;
  bullets = [];
  shake = 6;
}
function finishRoomTransition() {
  const encounters = RoomData.awakening.encounters;
  if (stage.number !== 1) {
    state.mode = "playing";
    return;
  }
  for (const pickup of pickups) collectPickup(pickup);
  const advanced = RoomData.advanceRoomState(
    { ...state, recordings, echoes, bullets, enemies, particles, pickups: [] },
    encounters.length
  );
  if (!advanced) {
    state.mode = "playing";
    return;
  }
  state.roomIndex = advanced.roomIndex;
  state.roomCleared = advanced.roomCleared;
  state.roomTransition = 0;
  state.loop = advanced.loop;
  state.roomRewardResolved = false;
  recordings = advanced.recordings;
  echoes = advanced.echoes;
  bullets = advanced.bullets;
  particles = advanced.particles;
  enemies = advanced.enemies;
  warnings = [];
  state.mode = "playing";
  resetLoopWorld();
  flash = 0.12;
}
function updateRoomProgression() {
  if (activeWorld()) return;
  const encounter = currentEncounter();
  if (!encounter || encounter.objective === "anchor") return;
  if (!state.roomCleared && warnings.length === 0 && enemies.every((enemy) => !enemy.alive)) {
    state.roomCleared = true;
    state.score += 300;
    burst(encounter.exit.x, encounter.exit.y, "#45f5e9", 24, 170);
    tone("sine", 460, 0.25, 0.05, 380);
    offerRoomEquipment(encounter);
  }
  if (state.mode !== "playing") return;
  if (state.roomCleared && hit(player, encounter.exit)) enterNextRoom();
}
function startStage() {
  initAudio();
  cancelAnimationFrame(raf);
  diff = DIFFICULTIES[save.difficulty] || DIFFICULTIES.operative;
  stats = buildStats();
  state = freshState();
  state.mode = "playing";
  recordings = [];
  core = { hp: stage.difficulty.coreHp };
  resetLoopWorld();
  state.playtestRun = playtestEnabled
    ? PlaytestCore.createRun({
        stageId: stage.id,
        difficulty: diff.id,
        loadout: save.loadout,
        upgrades: save.upgrades,
      })
    : null;
  state.playtestLastX = player.x;
  state.playtestLastY = player.y;
  hideAll();
  mouse.inside = canvas.matches(":hover");
  ui.hud.classList.remove("hidden");
  ui.muteGame.classList.remove("hidden");
  last = performance.now();
  accumulator = 0;
  musicBeat = 0;
  musicNextBeat = audio?.currentTime || 0;
  musicScene = "combat";
  raf = requestAnimationFrame(frame);
}
function endLoop(reason) {
  if (state.ending || state.mode !== "playing") return;
  state.ending = true;
  state.charging = false;
  state.current.alive = reason !== "death";
  if (stats.override) {
    state.mode = "recordOverride";
    screens.override.classList.remove("hidden");
    return;
  }
  completeLoop(true, reason);
}
function completeLoop(keep, reason = "override") {
  commitRecording(keep);
  screens.override.classList.add("hidden");
  if (state.noHit && reason !== "death") state.score += 350;
  if (reason === "early") state.score += 100;
  sfx.loop();
  if (state.loop >= diff.maxLoops) {
    setTimeout(() => endStage(false), 100);
    return;
  }
  state.mode = "loopTransition";
  transitionTimer = BASE.TRANSITION;
  $("transition-echo").textContent = keep
    ? `ECHO ${String(recordings.length).padStart(2, "0")} ONLINE`
    : "TIMELINE DISCARDED";
  screens.transition.classList.remove("hidden");
}
function nextLoop() {
  state.loop++;
  state.mode = "playing";
  state.shieldRefresh = true;
  screens.transition.classList.add("hidden");
  resetLoopWorld();
  playCue("echoJoin");
  timeWarp = 0.65;
  last = performance.now();
}
function calculateRank(win) {
  const totalSurvivors = activeWorld()?.escortRules?.totalSurvivors || 12;
  const sync = state.totalCoreHits ? state.echoCoreHits / state.totalCoreHits : 0,
    rescue = shuttle ? shuttle.survivors / totalSurvivors : 1;
  let value =
    (win ? 500 : 0) +
    (diff.maxLoops - state.loop) * 90 +
    (Math.max(0, stats.maxHp - state.damageTaken) / stats.maxHp) * 180 +
    sync * 180 +
    rescue * 150 +
    (Math.max(0, diff.loopTime - state.elapsed) / diff.loopTime) * 100;
  value *= diff.scoreMult;
  const t = stage.ranks,
    rank = value >= t.S ? "S" : value >= t.A ? "A" : value >= t.B ? "B" : "C";
  return {
    rank,
    value: Math.round(value),
    sync,
    rescue,
    reasons: [
      `${state.loop}개 루프 사용`,
      `피해 ${Math.round(state.damageTaken)}`,
      `Echo 협공 ${Math.round(sync * 100)}%`,
      shuttle
        ? `생존자 ${shuttle.survivors}/${totalSurvivors}`
        : `잔여 시간 ${Math.max(0, diff.loopTime - state.elapsed).toFixed(1)}초`,
    ],
  };
}
function endStage(win) {
  if (state.mode === "result") return;
  state.mode = "result";
  cancelAnimationFrame(raf);
  const rank = calculateRank(win),
    final = Math.round((state.score + rank.value) * diff.scoreMult);
  state.finalRank = rank;
  state.finalScore = final;
  if (state.playtestRun) {
    writePlaytestRun(
      PlaytestCore.finishRun(state.playtestRun, {
        win,
        activeSeconds: state.stageActiveSeconds,
        loops: state.loop,
        echoes: recordings.length,
        kills: state.kills,
        damageTaken: state.damageTaken,
        score: final,
        coreDamage: state.coreDamage,
        totalCoreHits: state.totalCoreHits,
        echoCoreHits: state.echoCoreHits,
        bestCombo: state.bestCombo,
        overloads: state.overloads,
        deathCause: state.deathCause,
      })
    );
    state.playtestRun = null;
  }
  hideAll();
  screens.result.classList.remove("hidden");
  $("result-kicker").textContent = win ? "ANCHOR COLLAPSED // TIME RESTORED" : "TEMPORAL LOCKDOWN";
  $("result-title").textContent = win
    ? `${stage.name} CLEAR`
    : state.failureReason || "BREACH FAILED";
  $("rank-badge").textContent = rank.rank;
  $("rank-reasons").textContent = rank.reasons.join(" · ");
  $("result-score").textContent = final;
  $("result-loops").textContent = `${state.loop} / ${diff.maxLoops}`;
  $("result-sync").textContent = `${Math.round(rank.sync * 100)}%`;
  $("result-hurt").textContent = Math.round(state.damageTaken);
  const totalSurvivors = activeWorld()?.escortRules?.totalSurvivors || 12;
  $("result-rescue").textContent = shuttle ? `${shuttle.survivors} / ${totalSurvivors}` : "—";
  $("result-combo").textContent = state.bestCombo;
  $("result-overloads").textContent = state.overloads;
  $("result-next").textContent = win ? (stage.number === 5 ? "엔딩 보기" : "장비 회수") : "재시도";
  if (win) {
    const old = save.stages[stage.id] || {};
    save.stages[stage.id] = {
      score: Math.max(old.score || 0, final),
      rank: betterRank(old.rank, rank.rank),
    };
    save.unlockedStage = Math.max(save.unlockedStage, Math.min(5, stage.number + 1));
    save.hasCampaign = true;
    if (CampaignCore.isFinalVictory(stage.number, win)) save.campaignComplete = true;
    state.firstClear = !old.rank;
    persist();
    sfx.win();
  } else sfx.lose();
}
function betterRank(a, b) {
  const order = "SABC";
  if (!a) return b;
  return order.indexOf(b) < order.indexOf(a) ? b : a;
}

// ── 메뉴, 업그레이드와 UI 흐름 ─────────────────────────────────────────────
function hideAll() {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  ui.hud.classList.add("hidden");
  ui.muteGame.classList.add("hidden");
}
function showScreen(name) {
  hideAll();
  state.mode = name;
  screens[name].classList.remove("hidden");
}
function renderDifficulties() {
  $("difficulty-cards").innerHTML = Object.values(DIFFICULTIES)
    .map(
      (d) =>
        `<button class="card" data-diff="${d.id}"><span class="num">${d.loopTime}s // ${d.maxLoops} LOOPS</span><h3>${d.name}</h3><p>${d.help}</p><span class="tag">×${d.scoreMult} SCORE</span></button>`
    )
    .join("");
}
function showStageSelect() {
  showScreen("stage");
  $("campaign-status").textContent =
    `${DIFFICULTIES[save.difficulty].name} // UPGRADES ${save.upgrades.length}/9 // EQUIPMENT ${save.equipmentOwned.length}/9`;
  $("stage-cards").innerHTML = STAGES.map((s) => {
    const locked = s.locked || s.number > save.unlockedStage,
      r = save.stages[s.id],
      visual = s.visual || STAGES[0].visual;
    return `<button class="card stage-card ${locked ? "locked" : ""}" style="--stage-color:${visual.color}" data-stage="${s.id}" ${locked ? "disabled" : ""}><span class="stage-motif">${UiCore.iconSvg(visual.motif, `${s.name} 구역`)}</span><span class="num">구역 ${String(s.number).padStart(2, "0")}</span>${r ? `<b class="rank">${r.rank}</b>` : ""}<h3>${s.name}</h3><p>${s.subtitle}</p><span class="stage-route">${locked ? "접근 권한 필요" : "진입 가능"}</span><span class="tag">${locked ? "잠김" : "시간 앵커"}</span></button>`;
  }).join("");
}
function showEnding() {
  showScreen("ending");
  const summary = CampaignCore.summarize(save.stages);
  $("ending-cleared").textContent = `${summary.cleared} / 5`;
  $("ending-score").textContent = summary.totalScore.toLocaleString("ko-KR");
  $("ending-s-ranks").textContent = summary.sRanks;
}
function showBriefing(s) {
  stage = s;
  showScreen("briefing");
  $("briefing-kicker").textContent = `STAGE 0${s.number} // NEXUS COMMS`;
  $("briefing-title").textContent = s.name;
  $("briefing-subtitle").textContent = s.subtitle;
  $("briefing-copy").innerHTML = s.briefing.map((x) => `<div>› ${x}</div>`).join("");
  $("briefing-objective").textContent =
    s.number === 1
      ? `${s.objective.requiredRelays}개 릴레이 동시 동기화 → Chrono Anchor 파괴`
      : s.number === 2
        ? "Echo로 스위치 사격 유지 → 장벽 통과 → 이동 릴레이 동기화"
        : "탈출선 호위 기록 → 릴레이 동기화 → Anchor 파괴";
}
function upgradeCandidates() {
  const owned = new Set(save.upgrades),
    blocked = new Set(UPGRADES.filter((u) => owned.has(u.id)).flatMap((u) => u.incompatible)),
    blockedByEquipment = new Set(
      Object.values(save.loadout)
        .map(equipmentItem)
        .filter(Boolean)
        .flatMap((item) => item.incompatibleUpgrades || [])
    );
  return UPGRADES.filter(
    (u) => !owned.has(u.id) && !blocked.has(u.id) && !blockedByEquipment.has(u.id)
  )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}
function showUpgrades() {
  showScreen("upgrade");
  const c = upgradeCandidates();
  if (!c.length) {
    showStageSelect();
    return;
  }
  $("upgrade-cards").innerHTML = c
    .map((u) => {
      const copy = localized("upgrades", u.id) || {
        name: "알 수 없는 강화",
        description: uiCopy().emptyDescription,
        detail: "",
      };
      const iconKind =
        u.category === "WEAPON" ? "weapon" : u.category === "HULL" ? "armor" : "relic";
      const category = uiCopy().categories[u.category] || u.category;
      return `<button class="card choice-card upgrade-card slot-${iconKind} rarity-${u.rarity}" data-upgrade="${u.id}"><span class="choice-icon">${UiCore.iconSvg(iconKind, category)}</span><span class="num">${category} · ${uiCopy().rarities[u.rarity] || u.rarity}</span><h3>${copy.name}</h3><p class="choice-description">${copy.description}</p><p class="statline">${copy.detail}</p></button>`;
    })
    .join("");
}
function equipmentItem(id) {
  return EquipmentData.items.find((item) => item.id === id) || null;
}
function equipmentCandidates() {
  return EquipmentCore.getEquipmentCandidates({
    items: EquipmentData.items,
    loadout: save.loadout,
    ownedItems: save.equipmentOwned,
    upgrades: save.upgrades,
    count: EquipmentData.rewards.candidateCount,
    rarityWeights: EquipmentData.rarityWeights,
    rng: Math.random,
  });
}
function offerRoomEquipment(encounter) {
  if (state.roomRewardResolved) return;
  state.roomRewardResolved = true;
  if (
    EquipmentCore.shouldOfferEquipmentReward(
      encounter.objective,
      EquipmentData.rewards,
      Math.random
    )
  )
    showEquipmentSelection("room");
}
function equipmentCard(item) {
  const current = equipmentItem(save.loadout[item.slot]);
  const validation = EquipmentCore.validateLoadout(
    { ...save.loadout, [item.slot]: item.id },
    EquipmentData,
    save.upgrades
  );
  const blocked = !validation.valid;
  const copy = localized("equipment", item.id) || {
      name: "알 수 없는 장비",
      description: uiCopy().emptyDescription,
      stats: [],
      pros: "",
      cons: "",
    },
    currentCopy = current ? localized("equipment", current.id) : null,
    slotName = uiCopy().slots[item.slot] || item.slot,
    rarityName = uiCopy().rarities[item.rarity] || item.rarity;
  return `<button class="card choice-card equipment-card slot-${item.slot} rarity-${item.rarity}" data-equipment="${item.id}" ${blocked ? "disabled" : ""}><span class="equip-icon">${UiCore.iconSvg(item.slot, slotName)}</span><span class="num">${slotName} · ${rarityName}</span><h3>${copy.name}</h3><p class="choice-description">${copy.description}</p><p class="statline">${copy.stats.join(" · ")}</p><p class="current">${uiCopy().current}: ${currentCopy?.name || uiCopy().none}</p><p class="pros">${uiCopy().advantage}: ${copy.pros}</p><p class="cons">${uiCopy().drawback}: ${copy.cons}</p>${blocked ? `<p class="blocked-reason">${uiCopy().incompatible}</p>` : ""}</button>`;
}
function showEquipmentSelection(nextFlow) {
  const candidates = equipmentCandidates();
  pendingEquipmentFlow = nextFlow;
  equipmentSelectionLocked = false;
  if (!candidates.length) {
    if (nextFlow === "room") pendingEquipmentFlow = null;
    else finishEquipmentSelection();
    return false;
  }
  hideAll();
  state.mode = "equipmentSelect";
  screens.equipment.classList.remove("hidden");
  $("equipment-kicker").textContent =
    nextFlow === "room" ? "전투 구역 보상 · 장비" : "앵커 보상 · 장비";
  $("equipment-cards").innerHTML = candidates.map(equipmentCard).join("");
  requestAnimationFrame(() => $("equipment-cards").querySelector("button:not(:disabled)")?.focus());
  return true;
}
function finishEquipmentSelection() {
  const nextFlow = pendingEquipmentFlow;
  pendingEquipmentFlow = null;
  equipmentSelectionLocked = false;
  if (nextFlow === "room") {
    hideAll();
    state.mode = "playing";
    ui.hud.classList.remove("hidden");
    ui.muteGame.classList.remove("hidden");
    last = performance.now();
    accumulator = 0;
  } else if (nextFlow === "upgrade") showUpgrades();
  else showStageSelect();
}
function selectEquipment(itemId) {
  if (equipmentSelectionLocked || state.mode !== "equipmentSelect") return;
  const item = equipmentItem(itemId);
  if (!item) return;
  const previousStats = stats;
  const claim = EquipmentCore.claimEquipmentReward({
    loadout: save.loadout,
    ownedItems: save.equipmentOwned,
    itemId,
    equipmentData: EquipmentData,
    upgrades: save.upgrades,
  });
  if (!claim.selected) return;
  equipmentSelectionLocked = true;
  save.loadout = claim.loadout;
  save.equipmentOwned = claim.ownedItems;
  writeLatestPlaytestReward(itemId);
  stats = buildStats();
  if (player) {
    player.hp = Math.max(1, Math.min(stats.maxHp, player.hp));
    player.dashStock = Math.min(stats.dashCharges, player.dashStock);
    if (stats.maxHp < previousStats.maxHp) burst(player.x, player.y, "#c48bff", 12, 110);
  }
  persist();
  finishEquipmentSelection();
}
function updateHUD() {
  const objective = activeObjective();
  const world = activeWorld();
  ui.stage.textContent = `S${stage.number} // ${stage.name}`;
  ui.loop.textContent = `${state.loop} / ${diff.maxLoops}`;
  ui.time.textContent = Math.max(0, diff.loopTime - state.elapsed).toFixed(1);
  ui.echoes.textContent = echoes.length;
  ui.hp.style.width = `${100 * clamp(player.hp / stats.maxHp, 0, 1)}%`;
  ui.shieldHud.classList.toggle("hidden", stats.loopShield <= 0);
  ui.shield.style.width = `${100 * clamp((player.shield || 0) / Math.max(1, stats.loopShield), 0, 1)}%`;
  ui.shieldValue.textContent = Math.ceil(player.shield || 0);
  ui.dash.style.width = `${100 * (player.dashStock / stats.dashCharges)}%`;
  ui.overdrive.style.width = `${100 * clamp(state.overdriveGauge / GameBalance.overdrive.maxGauge, 0, 1)}%`;
  ui.overdriveLabel.textContent =
    state.overdriveTimer > 0 ? `오버드라이브 ${state.overdriveTimer.toFixed(1)}초` : "오버드라이브";
  ui.core.style.width = `${anchorActive() ? (100 * core.hp) / core.maxHp : 0}%`;
  ui.score.textContent = Math.round(state.score);
  const slotMeta = {
    weapon: { label: uiCopy().slots.weapon },
    armor: { label: uiCopy().slots.armor },
    relic: { label: uiCopy().slots.relic },
  };
  ui.loadout.innerHTML = Object.entries(save.loadout)
    .map(([slot, id]) => {
      const item = equipmentItem(id),
        meta = slotMeta[slot],
        copy = item ? localized("equipment", item.id) : null;
      return `<span class="loadout-slot slot-${slot}" tabindex="0" data-tooltip="${copy?.description || `${meta.label}: ${uiCopy().none}`}"><i class="slot-icon">${UiCore.iconSvg(slot, meta.label)}</i><span><small>${meta.label}</small><b>${copy?.name || uiCopy().none}</b></span></span>`;
    })
    .join("");
  ui.shuttleHud.classList.toggle("hidden", !shuttle);
  if (shuttle) {
    ui.shuttle.style.width = `${(100 * shuttle.hp) / shuttle.maxHp}%`;
    ui.survivors.textContent = `${shuttle.survivors} / ${world?.escortRules?.totalSurvivors || 12}`;
    ui.shuttleHud.classList.toggle("danger", state.shuttleAlert > 0);
  }
  const gate = walls.find((w) => w.gate);
  const encounter = currentEncounter();
  const zone = world ? WorldCore.zoneAt(world.zones, player) : null;
  const progressionGate =
    world?.progressionGates?.find((item) => item.zoneId === zone?.id) ||
    (zone && ["anchor", "final-boss"].includes(zone.objective) ? { zoneId: zone.id } : null);
  const progressionRecord = zone ? state.zoneProgress[zone.id] : null;
  const activeBoss = enemies.find((enemy) => enemy.alive && enemy.bossConfig);
  const bossBarrierRemaining = activeBoss
    ? Math.max(0, (activeBoss.bossState.shieldOpenUntil || 0) - state.elapsed)
    : 0;
  ui.objective.textContent = activeBoss
    ? bossBarrierRemaining > 0
      ? `시간 방벽 개방 · ${bossBarrierRemaining.toFixed(1)}초`
      : "플레이어와 Echo의 동시 사격 필요"
    : world
      ? progressionGate && progressionRecord && !progressionRecord.complete
        ? ZoneObjectiveCore.shortStatus(zone, progressionRecord, progressionGate, {
            difficultyId: diff.id,
            shuttle,
            escortRules: world.escortRules,
            switches,
          })
        : UiCore.objectiveAlert({
            zoneName: zone?.name,
            anchor: zone?.objective === "anchor",
            shieldOpen: state.shieldTimer > 0,
            activeRelays: relays.filter((r) => r.active).length,
            requiredRelays: objective.requiredRelays,
            gateClosed: Boolean(gate && !gate.open && player.x > 1250 && player.x < 2100),
          })
      : encounter && encounter.objective !== "anchor"
        ? state.roomCleared
          ? "ROOM CLEAR — REACH THE EXIT"
          : `${encounter.name} — ELIMINATE HOSTILES`
        : state.shieldTimer > 0
          ? `ANCHOR EXPOSED // ${state.shieldTimer.toFixed(1)}s`
          : stage.number === 2 && gate && !gate.open
            ? "KEEP SWITCH CHARGED — OPEN THE GATE"
            : relays.some((r) => r.active)
              ? `${relays.filter((r) => r.active).length} / ${objective.requiredRelays} RELAYS SYNCHRONIZED`
              : stage.number === 3
                ? "RECORD ESCORT FIRE — THEN ATTACK RELAYS"
                : echoes.length
                  ? "COORDINATE ALL THREE RELAYS"
                  : "RECORD FIRE ON ONE RELAY";
  ui.tip.textContent =
    diff.id === "story"
      ? stage.number === 2
        ? "왼쪽 스위치를 Echo가 사격하도록 기록하면 중앙 통로가 열립니다."
        : stage.number === 3
          ? "탈출선 주변의 적을 쏘는 기록을 먼저 남기세요."
          : world
            ? "첫 시간선의 전투 경로가 다음 루프에서 그대로 재생됩니다. 더 깊이 전진하세요."
            : "한 릴레이를 계속 사격한 뒤 R로 기록을 완성하세요."
      : state.loop === 1 && state.elapsed < 6
        ? "지금의 이동·조준·사격은 다음 시간선에서 반복됩니다."
        : "";
}
function togglePause(force = false) {
  state.paused = force || !state.paused;
  screens.pause.classList.toggle("hidden", !state.paused);
  last = performance.now();
}

// ── 렌더링 ─────────────────────────────────────────────────────────────────
function resize() {
  const d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * d;
  canvas.height = innerHeight * d;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  view.scale = Math.min(innerWidth / BASE.W, innerHeight / BASE.H);
  view.ox = (innerWidth - BASE.W * view.scale) / 2;
  view.oy = (innerHeight - BASE.H * view.scale) / 2;
  ctx.setTransform(d, 0, 0, d, 0, 0);
}
function render() {
  const motionScale = reducedMotion() ? 0.18 : 1;
  ctx.save();
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.translate(
    view.ox + (Math.random() - 0.5) * shake * motionScale,
    view.oy + (Math.random() - 0.5) * shake * motionScale
  );
  ctx.scale(view.scale, view.scale);
  ctx.translate(-camera.x, -camera.y);
  renderArena();
  if (player) {
    renderObjectives();
    renderWarnings();
    renderExplosions();
    renderPickups();
    renderParticles();
    renderBullets();
    renderEnemies();
    renderEchoes();
    renderActor(player, false);
    renderCursor();
  }
  ctx.restore();
  renderWorldGuidance();
  if (timeWarp > 0) {
    const alpha = timeWarp * (reducedMotion() ? 0.08 : 0.2);
    const gradient = ctx.createRadialGradient(
      innerWidth / 2,
      innerHeight / 2,
      innerHeight * 0.12,
      innerWidth / 2,
      innerHeight / 2,
      innerWidth * 0.65
    );
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.72, `rgba(69,245,233,${alpha * 0.35})`);
    gradient.addColorStop(1, `rgba(121,75,255,${alpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.strokeStyle = `rgba(180,255,249,${alpha * 1.8})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      innerWidth / 2,
      innerHeight / 2,
      innerWidth * (0.16 + (1 - timeWarp) * 0.35),
      innerHeight * (0.12 + (1 - timeWarp) * 0.28),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
  if (state.mode === "roomTransition") {
    ctx.fillStyle = `rgba(3,8,18,${clamp(1 - state.roomTransition / 0.4, 0, 0.92)})`;
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "rgba(175,255,248,.85)";
    ctx.font = "700 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BREACHING NEXT ROOM", innerWidth / 2, innerHeight / 2);
    ctx.textAlign = "start";
  }
  if (state.overloadText > 0) {
    ctx.fillStyle = `rgba(190,255,249,${clamp(state.overloadText * 1.4, 0, 1)})`;
    ctx.font = "700 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText(state.overloadLabel, innerWidth / 2, innerHeight * 0.28);
    ctx.textAlign = "start";
  }
  if (flash > 0) {
    ctx.fillStyle = `rgba(255,45,73,${flash * 0.55})`;
    ctx.fillRect(0, 0, innerWidth, innerHeight);
  }
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#9ddfff";
  for (let y = 0; y < innerHeight; y += 5) ctx.fillRect(0, y, innerWidth, 1);
  ctx.globalAlpha = 1;
  shake *= 0.82;
  flash *= 0.84;
  timeWarp *= reducedMotion() ? 0.68 : 0.9;
}
function renderArena() {
  const size = worldSize();
  ctx.fillStyle = stage?.arena?.tint || "#060916";
  ctx.fillRect(0, 0, size.width, size.height);
  for (const [index, room] of rooms.entries()) {
    ctx.fillStyle = index % 2 ? "rgba(28,46,74,.2)" : "rgba(18,67,77,.16)";
    ctx.fillRect(room.x, room.y, room.w, room.h);
    ctx.strokeStyle = "rgba(107,181,216,.18)";
    ctx.strokeRect(room.x, room.y, room.w, room.h);
    ctx.fillStyle = "rgba(166,220,237,.28)";
    ctx.font = "11px monospace";
    ctx.fillText(room.name, room.x + 13, room.y + 20);
    const seed = (index + 1) * 137;
    for (let i = 0; i < Math.max(4, Math.floor(room.w / 260)); i++) {
      const x = room.x + 95 + ((seed + i * 251) % Math.max(120, room.w - 190));
      const y = room.y + 90 + ((seed * 3 + i * 173) % Math.max(120, room.h - 180));
      ctx.fillStyle = i % 3 ? "rgba(29,88,91,.10)" : "rgba(108,39,78,.11)";
      ctx.beginPath();
      ctx.ellipse(x, y, 35 + (i % 3) * 18, 12 + (i % 2) * 9, i * 0.7, 0, 6.283);
      ctx.fill();
      ctx.strokeStyle = "rgba(115,167,194,.10)";
      ctx.beginPath();
      ctx.moveTo(x - 30, y);
      ctx.lineTo(x - 8, y - 12);
      ctx.lineTo(x + 7, y + 9);
      ctx.lineTo(x + 32, y - 4);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = "rgba(66,95,142,.12)";
  for (let x = 0; x < size.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size.height);
    ctx.stroke();
  }
  for (let y = 0; y < size.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size.width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(76,244,232,.22)";
  ctx.strokeRect(25, 25, size.width - 50, size.height - 50);
  for (const hazard of activeWorld()?.hazards || []) {
    ctx.fillStyle = "rgba(126,38,83,.22)";
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.strokeStyle = "rgba(196,75,125,.48)";
    ctx.setLineDash([18, 12]);
    ctx.strokeRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.setLineDash([]);
  }
  const encounter = currentEncounter();
  if (encounter) {
    ctx.fillStyle = "rgba(210,245,255,.52)";
    ctx.font = "14px monospace";
    ctx.fillText(`ROOM ${state.roomIndex + 1} // ${encounter.name}`, 45, 72);
    if (encounter.exit) {
      const open = state.roomCleared;
      ctx.strokeStyle = open ? "#45f5e9" : "#ff4768";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(encounter.exit.x, encounter.exit.y, encounter.exit.r, 0, 6.283);
      ctx.stroke();
      ctx.fillStyle = open ? "rgba(69,245,233,.15)" : "rgba(255,71,104,.12)";
      ctx.fill();
    }
  }
  for (const w of walls) {
    if (!w.open) {
      ctx.fillStyle = "rgba(0,0,0,.38)";
      ctx.fillRect(w.x + 9, w.y + 10, w.w, w.h);
    }
    ctx.fillStyle = w.open
      ? "rgba(69,245,233,.08)"
      : w.progressionGate
        ? "rgba(124,48,91,.62)"
        : "rgba(70,116,185,.45)";
    ctx.fillRect(w.x, w.y, w.w, w.h);
    if (!w.open) {
      ctx.strokeStyle = w.progressionGate ? "rgba(239,94,151,.7)" : "rgba(151,207,247,.48)";
      ctx.lineWidth = 2;
      ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
      ctx.strokeStyle = "rgba(121,186,242,.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (w.w > w.h) {
        for (let x = w.x + 10; x < w.x + w.w; x += 26) {
          ctx.moveTo(x, w.y + 3);
          ctx.lineTo(x + 8, w.y + w.h - 3);
        }
      } else {
        for (let y = w.y + 10; y < w.y + w.h; y += 26) {
          ctx.moveTo(w.x + 3, y);
          ctx.lineTo(w.x + w.w - 3, y + 8);
        }
      }
      ctx.stroke();
    }
    if (w.gate) {
      ctx.strokeStyle = w.open ? "#45f5e9" : "#659cff";
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }
    if (w.progressionGate && !w.open) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,102,155,.55)";
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 9]);
      ctx.strokeRect(w.x - 4, w.y - 4, w.w + 8, w.h + 8);
      ctx.setLineDash([]);
      ctx.restore();
    }
  }
  if (shuttle) {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#79dcff";
    ctx.fillStyle = shuttle.hp > 0 ? "#367a9b" : "#312f3d";
    poly(shuttle.x, shuttle.y, shuttle.r, 6);
    ctx.fill();
    ctx.fillStyle = "#d8f6ff";
    ctx.fillRect(shuttle.x - 16, shuttle.y - 5, 32, 10);
    ctx.restore();
  }
}
function renderObjectives() {
  if (!anchorActive()) return;
  const objective = activeObjective();
  for (const s of switches) {
    const playerLinked = s.hitSources?.includes("player");
    const echoLinked = s.hitSources?.some((source) => source.startsWith("echo:"));
    ctx.strokeStyle = playerLinked && echoLinked ? "#fff1c7" : echoLinked ? "#45f5e9" : "#d3a56f";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r + 7, -Math.PI / 2, -Math.PI / 2 + (s.charge / 100) * 6.283);
    ctx.stroke();
    ctx.fillStyle = "#16474b";
    poly(s.x, s.y, s.r, 4, Math.PI / 4);
    ctx.fill();
  }
  for (const r of relays) {
    const p = r.charge / objective.relayChargeMax;
    ctx.strokeStyle = r.active ? "#7fffee" : "#8d65e9";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r + 7, -Math.PI / 2, -Math.PI / 2 + p * 6.283);
    ctx.stroke();
    ctx.fillStyle = r.active ? "#5ff6e6" : "#382667";
    poly(r.x, r.y, r.r, 6, Math.PI / 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(153,109,255,.28)";
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(core.x, core.y);
    ctx.stroke();
  }
  ctx.save();
  const phase = state.anchorPhase;
  const urgency = phase === "critical" ? 2.4 : phase === "unstable" ? 1.7 : 1;
  ctx.shadowBlur = 24 + urgency * 5;
  ctx.shadowColor = state.shieldTimer > 0 ? "#ff405f" : "#488bff";
  ctx.fillStyle = phase === "critical" ? "#ff6b32" : phase === "unstable" ? "#ef3158" : "#d92d4d";
  poly(
    core.x,
    core.y,
    34 + Math.sin(state.elapsed * 7 * urgency) * urgency,
    8,
    performance.now() * 0.0002 * urgency
  );
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(core.x, core.y, 10, 0, 6.283);
  ctx.fill();
  if (phase !== "armored") {
    ctx.strokeStyle = "#fff0dc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(core.x - 22, core.y - 18);
    ctx.lineTo(core.x - 5, core.y - 2);
    ctx.lineTo(core.x - 18, core.y + 18);
    if (phase === "unstable" || phase === "critical") {
      ctx.moveTo(core.x + 20, core.y - 17);
      ctx.lineTo(core.x + 4, core.y + 3);
      ctx.lineTo(core.x + 22, core.y + 15);
    }
    ctx.stroke();
  }
  ctx.restore();
  if (state.shieldTimer <= 0) {
    ctx.strokeStyle = "#5798ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(core.x, core.y, core.r + 13, 0, 6.283);
    ctx.stroke();
  }
}
function renderActor(o, isEcho) {
  ctx.save();
  ctx.translate(o.x, o.y);
  const facing = Math.round(o.angle / (Math.PI / 4)) * (Math.PI / 4);
  const hurt = isEcho ? 0 : o.hurtAnim || 0;
  const weaponId = isEcho ? o.weaponId : save.loadout.weapon;
  const armorId = isEcho ? null : save.loadout.armor;
  const relicId = save.loadout.relic;
  ctx.translate(Math.sin(hurt * 28) * hurt * 3, 0);
  ctx.rotate(facing);
  ctx.globalAlpha = isEcho ? 0.62 : 1;
  ctx.shadowBlur = 15;
  ctx.shadowColor = isEcho ? "#45f5e9" : "#ffb45d";
  const suit = isEcho ? "#45f5e9" : hurt > 0.45 ? "#ff637b" : "#f5f8ff";
  const accent = isEcho ? "#77fff5" : "#ffab55";
  if (!isEcho && armorId === "hunter-coat") {
    ctx.fillStyle = "rgba(141,88,205,.72)";
    ctx.beginPath();
    ctx.moveTo(-6, -10);
    ctx.lineTo(-28, -16);
    ctx.lineTo(-24, 16);
    ctx.lineTo(-6, 10);
    ctx.closePath();
    ctx.fill();
  }
  if (!isEcho && player.shield > 0) {
    ctx.strokeStyle = "rgba(100,207,255,.75)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, o.r + 10, 0, 6.283);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (!isEcho && relicId === "paradox-ring") {
    ctx.strokeStyle = "rgba(255,140,241,.55)";
    ctx.lineWidth = 1.5;
    for (const radius of [o.r + 15, o.r + 20]) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, state.elapsed, state.elapsed + 4.7);
      ctx.stroke();
    }
  }
  if (isEcho && relicId === "echo-lens") {
    ctx.strokeStyle = "rgba(135,255,248,.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, o.r + 11, 0, 6.283);
    ctx.stroke();
  }
  if (isEcho && relicId === "memory-core" && state.elapsed > o.rec.duration) {
    ctx.strokeStyle = "rgba(126,245,255,.7)";
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, o.r + 15 + Math.sin(state.elapsed * 8) * 3, 0, 6.283);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (state.overdriveTimer > 0) {
    ctx.strokeStyle = isEcho ? "rgba(133,255,246,.5)" : "rgba(255,224,112,.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, o.r + 7 + Math.sin(state.elapsed * 12) * 2, 0, 6.283);
    ctx.stroke();
  }
  const stride = Math.sin(o.animTime || 0) * 5 * (o.motion || 0);
  const bob = Math.abs(Math.sin(o.animTime || 0)) * 1.2 * (o.motion || 0);
  const recoil = (o.recoil || 0) * 5;
  const dashing = o.dashLeft > 0;
  if (dashing) ctx.scale(1.16, 0.86);

  // 다리: 진행 방향의 뒤쪽에서 좌우 보폭이 교차한다.
  ctx.strokeStyle = suit;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-6, -5);
  ctx.lineTo(-15 - stride, -7);
  ctx.moveTo(-6, 5);
  ctx.lineTo(-15 + stride, 7);
  ctx.stroke();

  // 어깨와 몸통: 위에서 본 방탄복 형태.
  ctx.fillStyle = suit;
  ctx.beginPath();
  ctx.roundRect(-9 - bob, -10, 19, 20, 7);
  ctx.fill();
  ctx.fillStyle = isEcho ? "rgba(8,44,50,.7)" : "#26334a";
  ctx.fillRect(-6 - bob, -7, 10, 14);
  if (!isEcho && armorId === "vector-harness") {
    ctx.fillStyle = "#69fff2";
    ctx.fillRect(-13, -9, 5, 5);
    ctx.fillRect(-13, 4, 5, 5);
  }

  // 머리와 바이저: 몸통 앞쪽에 배치해 바라보는 방향을 읽게 한다.
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(9 - bob, 0, 7, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = isEcho ? "#bafffa" : "#182033";
  ctx.fillRect(11 - bob, -4, 4, 8);

  // 총기는 연속 조준각을 유지한다. 몸만 8방향으로 스냅된다.
  ctx.save();
  ctx.rotate(o.angle - facing);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(1, -7);
  ctx.lineTo(13 - recoil, -3);
  ctx.moveTo(1, 7);
  ctx.lineTo(13 - recoil, 3);
  ctx.stroke();
  const gunColor = isEcho ? "#77fff5" : equipmentItem(weaponId)?.visual.color || "#d8e2ed";
  const gunLength = weaponId === "pulse-rifle" ? 34 : weaponId === "breach-shotgun" ? 19 : 25;
  const gunWidth = weaponId === "breach-shotgun" ? 11 : 8;
  ctx.fillStyle = gunColor;
  ctx.fillRect(9 - recoil, -gunWidth / 2, gunLength, gunWidth);
  ctx.fillStyle = isEcho ? "#d5fffc" : "#fff1d7";
  ctx.fillRect(9 + gunLength - 5 - recoil, -2, 8, 4);
  ctx.restore();
  if (!isEcho && state.charging) {
    ctx.strokeStyle = "#ffe18a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, o.r + 8 + state.charge * 7, 0, 6.283);
    ctx.stroke();
  }
  ctx.restore();
}
function renderEchoes() {
  for (const e of echoes) if (!e.finished) renderActor(e, true);
}
function renderEnemies() {
  for (const e of enemies)
    if (e.alive) {
      const monster = MonsterData[e.type] || MonsterData.chaser;
      const color = e.targetShuttle ? "#d43f8e" : monster.color;
      const pulse = 1 + Math.sin(e.wobble * 4) * 0.06;
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.bossMovePose?.preparing && !BossCore.shieldOpen(e.bossState, state.elapsed)) {
        const markerX = e.bossMovePose.targetX - e.x;
        const markerY = e.bossMovePose.targetY - e.y;
        ctx.strokeStyle = "rgba(226,196,156,.78)";
        ctx.fillStyle = "rgba(226,196,156,.1)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 7]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(markerX, markerY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(markerX, markerY, e.r + 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      const target = e.targetShuttle && shuttle?.hp > 0 ? shuttle : player;
      const facing = e.bossConfig
        ? e.bossMoveFacing
        : monster.visual === "corrupted"
          ? e.moveFacing
          : Math.atan2(target.y - e.y, target.x - e.x);
      ctx.rotate(facing);
      ctx.scale(1 - e.hurt * 0.16, 1 + e.hurt * 0.2);
      if (monster.visual === "hound") renderRiftHound(e, color, pulse);
      else if (monster.visual === "caster") renderSporeCaster(e, color, pulse);
      else if (monster.visual === "brute") renderAnchorBrute(e, color, pulse);
      else renderSpecialMonster(e, monster, pulse, facing);
      if (e.bossConfig) {
        const shielded = !BossCore.shieldOpen(e.bossState, state.elapsed);
        ctx.strokeStyle = shielded ? "#73c9bf" : "rgba(115,201,191,.2)";
        ctx.lineWidth = shielded ? 4 : 2;
        ctx.beginPath();
        ctx.arc(0, 0, e.r + 12, 0, Math.PI * 2);
        ctx.stroke();
        if (e.telegraph > 0) {
          const profile = BossCore.attackProfile(e.bossConfig, e.bossPhase);
          ctx.strokeStyle = "#e2c49c";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            e.r + 21,
            -Math.PI / 2,
            -Math.PI / 2 + Math.PI * 2 * (1 - e.telegraph / profile.telegraphSeconds)
          );
          ctx.stroke();
          ctx.save();
          ctx.rotate(e.bossAim - facing);
          ctx.strokeStyle = "rgba(255,116,132,.72)";
          ctx.lineWidth = 2;
          if (
            ["charge", "fan", "pursuit-fan", "echo-fan", "barrier-lines"].includes(e.bossPattern)
          ) {
            ctx.beginPath();
            ctx.moveTo(e.r + 8, 0);
            ctx.lineTo(e.r + (e.bossPattern === "charge" ? 300 : 180), 0);
            ctx.stroke();
          } else if (e.bossPattern === "safe-sector") {
            ctx.beginPath();
            ctx.arc(0, 0, e.r + 46, -0.42, 0.42);
            ctx.strokeStyle = "rgba(115,201,191,.85)";
            ctx.lineWidth = 7;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      ctx.restore();
      ctx.fillStyle = "#ff9aaa";
      ctx.fillRect(e.x - e.r, e.y - e.r - 8, (e.r * 2 * e.hp) / e.maxHp, 3);
    }
}
function renderSpecialMonster(e, monster, pulse, facing = 0) {
  ctx.fillStyle = e.hitFlash > 0 ? "#fff" : monster.color;
  if (monster.visual === "prime") {
    poly(0, 0, e.r * pulse, 8, Math.PI / 8);
    ctx.fill();
    ctx.strokeStyle = monster.accent;
    ctx.lineWidth = 4;
    for (const radius of [e.r * 0.5, e.r + 10]) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, e.wobble, e.wobble + Math.PI * 1.35);
      ctx.stroke();
    }
  } else if (monster.visual === "corrupted") {
    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = monster.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.lineTo(10, -7);
    ctx.lineTo(17, 0);
    ctx.lineTo(10, 7);
    ctx.lineTo(-14, 10);
    ctx.closePath();
    ctx.fill();
    for (const pending of e.corruptPending || []) {
      const progress = 1 - pending.timer / CorruptedEchoCore.CONFIG.telegraphSeconds;
      ctx.save();
      ctx.rotate(pending.angle - facing);
      ctx.strokeStyle = `rgba(255,96,128,${0.25 + progress * 0.65})`;
      ctx.lineWidth = 2 + progress * 2;
      ctx.beginPath();
      ctx.moveTo(e.r + 5, 0);
      ctx.lineTo(e.r + 90, 0);
      ctx.stroke();
      ctx.restore();
    }
    ctx.stroke();
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, e.r + 8 + Math.sin(e.wobble * 3) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  } else if (monster.visual === "leech") {
    ctx.beginPath();
    ctx.ellipse(0, 0, e.r * 1.4 * pulse, e.r * 0.55, 0, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = monster.accent;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-5, side * 4);
      ctx.lineTo(-19, side * 12);
      ctx.stroke();
    }
  } else if (monster.visual === "guard") {
    poly(0, 0, e.r * pulse, 6, Math.PI / 6);
    ctx.fill();
    ctx.strokeStyle = monster.accent;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, e.r + 7, -1.2, 1.2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, e.r * pulse, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = monster.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.55, 0, 6.283);
    ctx.stroke();
  }
  ctx.fillStyle = monster.accent;
  ctx.beginPath();
  ctx.arc(6, 0, 3, 0, 6.283);
  ctx.fill();
}
function renderExplosions() {
  for (const blast of explosions) {
    const warning = clamp(blast.timer / 0.65, 0, 1);
    ctx.fillStyle = `rgba(255,92,45,${0.08 + (1 - warning) * 0.18})`;
    ctx.strokeStyle = blast.timer > 0 ? "#ffb14a" : "#fff0c4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(blast.x, blast.y, blast.r * (1 - warning * 0.18), 0, 6.283);
    ctx.fill();
    ctx.stroke();
  }
}
function renderPickups() {
  if (save.loadout.armor === "hunter-coat") {
    ctx.strokeStyle = "rgba(196,139,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, stats.shardRadius, 0, 6.283);
    ctx.stroke();
  }
  for (const pickup of pickups) {
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.rotate(pickup.phase);
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#45f5e9";
    ctx.fillStyle = "#a9fff7";
    poly(0, 0, 6 + Math.sin(pickup.phase) * 1.5, 4, Math.PI / 4);
    ctx.fill();
    ctx.restore();
  }
}
function renderRiftHound(e, color, pulse) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  const gait = Math.sin(e.wobble * 7) * 5;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-5, side * 7);
    ctx.lineTo(-14 + gait * side, side * 17);
    ctx.lineTo(-21 - gait * side, side * 20);
    ctx.stroke();
  }
  ctx.fillStyle = e.hitFlash > 0 ? "#fff" : color;
  ctx.beginPath();
  ctx.ellipse(-2, 0, e.r * 1.12 * pulse, e.r * 0.7, 0, 0, 6.283);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, -8);
  ctx.lineTo(24, 0);
  ctx.lineTo(8, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff1f4";
  ctx.fillRect(11, -5, 5, 3);
}
function renderSporeCaster(e, color, pulse) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * 6.283 + e.wobble * 0.18;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
    ctx.quadraticCurveTo(
      Math.cos(a + 0.5) * 19,
      Math.sin(a + 0.5) * 19,
      Math.cos(a) * 25,
      Math.sin(a) * 25
    );
    ctx.stroke();
  }
  ctx.fillStyle = e.hitFlash > 0 ? "#fff" : color;
  ctx.beginPath();
  ctx.ellipse(0, 0, e.r * pulse, e.r * 0.9, 0, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = "#471022";
  ctx.beginPath();
  ctx.arc(5, 0, 10, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = "#fff1f4";
  ctx.beginPath();
  ctx.arc(8, 0, 4, 0, 6.283);
  ctx.fill();
  if (e.fire < 0.45) {
    ctx.strokeStyle = MonsterData.shooter.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, 0, 14 + (0.45 - e.fire) * 12, 0, 6.283);
    ctx.stroke();
  }
}
function renderAnchorBrute(e, color, pulse) {
  ctx.fillStyle = e.hitFlash > 0 ? "#fff" : color;
  ctx.beginPath();
  ctx.ellipse(-3, 0, e.r * pulse, e.r * 0.92, 0, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = "#4a1125";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-5, side * 8);
    ctx.lineTo(9, side * 17);
    ctx.lineTo(21, side * 12);
    ctx.lineTo(14, side * 4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = MonsterData.blocker.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(5, 0, 12, -1.15, 1.15);
  ctx.stroke();
  ctx.fillStyle = "#fff1f4";
  ctx.fillRect(3, -3, 7, 6);
}
function renderBullets() {
  ctx.lineCap = "round";
  for (const b of bullets) {
    ctx.strokeStyle =
      b.team === "enemy"
        ? "#ff405f"
        : b.echo
          ? "rgba(69,245,233,.7)"
          : b.visualProfile?.color || "#ffe0a6";
    ctx.lineWidth = b.r * 1.4;
    ctx.beginPath();
    ctx.moveTo(b.px, b.py);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}
function renderParticles() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1) * (p.ghost ? 0.35 : 1);
    ctx.fillStyle = p.color;
    if (p.text) {
      ctx.font = `${p.size}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.shard) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 9);
      ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 6.283);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
function renderWarnings() {
  for (const w of warnings) {
    const corrupted = MonsterData[w.type]?.visual === "corrupted";
    ctx.strokeStyle = corrupted ? "#d33b78" : "#ff3f63";
    ctx.setLineDash(corrupted ? [6, 5] : []);
    ctx.beginPath();
    ctx.arc(w.x, w.y, 22 + (w.timer % 0.25) * 50, 0, 6.283);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
function renderCursor() {
  if (!mouse.inside) return;
  ctx.strokeStyle = "#efffff";
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10, 0, 6.283);
  ctx.moveTo(mouse.x - 16, mouse.y);
  ctx.lineTo(mouse.x - 6, mouse.y);
  ctx.moveTo(mouse.x + 6, mouse.y);
  ctx.lineTo(mouse.x + 16, mouse.y);
  ctx.stroke();
}
function renderWorldGuidance() {
  const world = activeWorld();
  if (!world || !player) return;
  const viewport = { width: innerWidth, height: innerHeight };
  const map = UiCore.getMinimapRect(viewport);
  ctx.save();
  ctx.fillStyle = "rgba(3,9,19,.9)";
  ctx.strokeStyle = "rgba(107,235,225,.52)";
  ctx.lineWidth = 1;
  ctx.fillRect(map.x, map.y, map.w, map.h);
  ctx.strokeRect(map.x, map.y, map.w, map.h);
  ctx.fillStyle = "rgba(201,238,243,.62)";
  ctx.font = "700 9px monospace";
  ctx.fillText("구역 지도", map.x + 9, map.y + 13);
  for (const zone of world.zones) {
    const topLeft = UiCore.projectToMinimap(zone, world, map);
    ctx.fillStyle = "rgba(80,133,161,.18)";
    ctx.fillRect(
      topLeft.x,
      topLeft.y,
      (zone.w / world.width) * map.w,
      (zone.h / world.height) * map.h
    );
  }
  const mark = (entity, color, shape = "dot", radius = 3) => {
    const point = UiCore.projectToMinimap(entity, world, map);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (shape === "diamond") {
      ctx.moveTo(point.x, point.y - radius);
      ctx.lineTo(point.x + radius, point.y);
      ctx.lineTo(point.x, point.y + radius);
      ctx.lineTo(point.x - radius, point.y);
      ctx.closePath();
      ctx.fill();
    } else if (shape === "ring") {
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  for (const enemy of enemies) if (enemy.alive) mark(enemy, "rgba(255,75,103,.76)", "dot", 1.7);
  for (const relay of relays)
    mark(relay, relay.active ? "#7fffee" : "#a673ff", "ring", relay.active ? 4 : 3);
  mark(core, "#ff4968", "diamond", 5);
  if (shuttle) mark(shuttle, state.shuttleAlert > 0 ? "#ff5570" : "#79dcff", "diamond", 4.5);
  for (const echo of echoes) if (!echo.finished) mark(echo, "#45f5e9", "ring", 3.4);
  mark(player, "#ffb45d", "diamond", 4.4);

  const target = core;
  const targetScreen = WorldCore.worldToScreen(target, camera, view);
  const targetMarker = UiCore.offscreenMarker(targetScreen, viewport, 28);
  if (!targetMarker.visible) {
    ctx.save();
    ctx.translate(targetMarker.x, targetMarker.y);
    ctx.rotate(targetMarker.angle);
    ctx.fillStyle = "#ff5570";
    ctx.beginPath();
    ctx.moveTo(11, 0);
    ctx.lineTo(-7, -6);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-7, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (shuttle && state.shuttleAlert > 0) {
    const shuttleScreen = WorldCore.worldToScreen(shuttle, camera, view);
    const alertMarker = UiCore.offscreenMarker(shuttleScreen, viewport, 44);
    ctx.save();
    ctx.translate(alertMarker.x, alertMarker.y);
    ctx.rotate(alertMarker.angle);
    ctx.fillStyle = "#ff5570";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-9, -8);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-9, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  for (const echo of echoes) {
    if (echo.finished) continue;
    const screen = WorldCore.worldToScreen(echo, camera, view);
    const marker = UiCore.offscreenMarker(screen, viewport);
    if (marker.visible) continue;
    ctx.strokeStyle = "rgba(69,245,233,.72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ── 업데이트 루프와 초기화 ─────────────────────────────────────────────────
function updatePlaytestStats(dt) {
  if (!state.playtestRun || !player) return;
  state.playtestSample += dt;
  if (state.playtestSample < 0.25) return;
  const sampleTime = state.playtestSample;
  const distance = Math.min(
    80,
    Math.hypot(player.x - state.playtestLastX, player.y - state.playtestLastY)
  );
  const world = activeWorld();
  const zone = world ? WorldCore.zoneAt(world.zones, player) : null;
  state.playtestRun = PlaytestCore.addSample(state.playtestRun, {
    dt: sampleTime,
    distance,
    speed: distance / sampleTime,
    zoneId: zone?.id || currentEncounter()?.id || "unknown",
  });
  state.playtestSample = 0;
  state.playtestLastX = player.x;
  state.playtestLastY = player.y;
}

function update(dt) {
  if (state.mode === "roomTransition") {
    const transition = RoomData.tickRoomTransition(state, dt);
    state.roomTransition = transition.state.roomTransition;
    updateParticles(dt);
    if (transition.ready) finishRoomTransition();
    return;
  }
  if (state.mode === "loopTransition") {
    transitionTimer -= dt;
    if (transitionTimer <= 0) nextLoop();
    return;
  }
  if (state.mode !== "playing" || state.paused) return;
  if (hitStop > 0) {
    hitStop -= dt;
    return;
  }
  state.elapsed += dt;
  updateMusic();
  state.stageActiveSeconds += dt;
  state.overdriveTimer = TemporalCore.tickOverdrive(state, dt).overdriveTimer;
  state.overloadText = Math.max(0, state.overloadText - dt);
  state.shuttleAlert = Math.max(0, state.shuttleAlert - dt);
  state.shuttleAlertSound = Math.max(0, state.shuttleAlertSound - dt);
  updateCameraTracking(dt);
  updatePlayer(dt);
  updateEchoes(dt);
  const currentZoneId = activeWorld()?.zones
    ? WorldCore.zoneAt(activeWorld().zones, player)?.id
    : null;
  for (let i = warnings.length - 1; i >= 0; i--) {
    warnings[i] = WaveCore.tickWarning(warnings[i], dt, currentZoneId);
    if (warnings[i].armed !== false && warnings[i].timer <= 0) {
      spawnEnemy(warnings[i]);
      warnings.splice(i, 1);
    }
  }
  updateEnemies(dt);
  updateWorldHazards(dt);
  updateBullets(dt);
  updateObjectives(dt);
  updateZoneProgression(dt);
  updateExplosions(dt);
  updatePickups(dt);
  updateRoomProgression();
  updateParticles(dt);
  updatePlaytestStats(dt);
  updateHUD();
  if (state.elapsed >= diff.loopTime) endLoop("time");
}
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  pollGamepad();
  if (!state.paused) {
    accumulator += dt;
    while (accumulator >= 1 / 120) {
      update(1 / 120);
      accumulator -= 1 / 120;
    }
  }
  render();
  if (!["result", "stage", "title", "difficulty", "briefing", "upgrade"].includes(state.mode))
    raf = requestAnimationFrame(frame);
}
function bindUI() {
  $("continue-button").onclick = () =>
    save.hasCampaign ? showStageSelect() : showScreen("difficulty");
  $("new-button").onclick = () =>
    save.hasCampaign ? showScreen("confirm") : showScreen("difficulty");
  $("confirm-new").onclick = () => {
    save = defaultSave();
    showScreen("difficulty");
  };
  document.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => showScreen("title")));
  $("change-difficulty").onclick = () => showScreen("difficulty");
  $("briefing-back").onclick = showStageSelect;
  $("deploy-button").onclick = startStage;
  $("abort-button").onclick = () => {
    state.paused = false;
    cancelAnimationFrame(raf);
    showStageSelect();
  };
  for (const id of ["music-volume", "effects-volume"])
    $(id).addEventListener("input", updateAudioSettings);
  $("keep-record").onclick = () => completeLoop(true);
  $("discard-record").onclick = () => completeLoop(false);
  $("result-map").onclick = () => {
    if (state.mode === "result" && core.hp <= 0 && stage.number === 5) showEnding();
    else if (state.mode === "result" && core.hp <= 0)
      showEquipmentSelection(state.firstClear ? "upgrade" : "stage");
    else showStageSelect();
  };
  $("result-next").onclick = () => {
    if (state.finalRank && state.mode === "result" && core.hp <= 0 && stage.number === 5)
      showEnding();
    else if (state.finalRank && state.mode === "result" && core.hp <= 0)
      showEquipmentSelection(state.firstClear ? "upgrade" : "stage");
    else startStage();
  };
  $("ending-map").onclick = showStageSelect;
  $("ending-new").onclick = () => showScreen("confirm");
  ui.muteTitle.onclick = toggleMute;
  ui.muteGame.onclick = toggleMute;
  $("difficulty-cards").onclick = (e) => {
    const b = e.target.closest("[data-diff]");
    if (!b) return;
    diff = DIFFICULTIES[b.dataset.diff];
    save.difficulty = diff.id;
    if (!save.hasCampaign) newCampaign();
    else {
      persist();
      showStageSelect();
    }
  };
  $("stage-cards").onclick = (e) => {
    const b = e.target.closest("[data-stage]");
    if (!b || b.disabled) return;
    showBriefing(STAGES.find((s) => s.id === b.dataset.stage));
  };
  $("upgrade-cards").onclick = (e) => {
    const b = e.target.closest("[data-upgrade]");
    if (!b) return;
    save.upgrades.push(b.dataset.upgrade);
    persist();
    showStageSelect();
  };
  $("equipment-cards").onclick = (e) => {
    const button = e.target.closest("[data-equipment]");
    if (button && !button.disabled) selectEquipment(button.dataset.equipment);
  };
  $("equipment-skip").onclick = () => {
    if (equipmentSelectionLocked || state.mode !== "equipmentSelect") return;
    equipmentSelectionLocked = true;
    finishEquipmentSelection();
  };
}
function applyLocalizedStaticCopy() {
  $("pause-help").textContent = uiCopy().pauseHelp;
  $("upgrade-help").textContent = uiCopy().upgradeHelp;
  $("equipment-help").textContent = uiCopy().equipmentHelp;
}
function init() {
  diff = DIFFICULTIES[save.difficulty] || DIFFICULTIES.operative;
  muted = save.muted;
  applyLocalizedStaticCopy();
  renderDifficulties();
  resize();
  bindInputs();
  bindUI();
  addEventListener("resize", resize);
  ui.muteTitle.textContent = `소리: ${muted ? "끔" : "켬"}`;
  $("music-volume").value = Math.round(save.audioSettings.music * 100);
  $("effects-volume").value = Math.round(save.audioSettings.effects * 100);
  render();
}

function openLocalUiPreview() {
  if (!["127.0.0.1", "localhost"].includes(location.hostname)) return;
  const params = new URLSearchParams(location.search);
  const preview = params.get("ui-preview");
  if (preview === "equipment") showEquipmentSelection("stage");
  if (preview === "upgrade") showUpgrades();
  if (preview === "pause") {
    stage = STAGES[0];
    startStage();
    togglePause(true);
  }
  if (preview === "ending") {
    save.stages = {
      ...save.stages,
      "prime-anchor": save.stages["prime-anchor"] || { rank: "A", score: 4200 },
    };
    showEnding();
  }
  const stagePreview = Number(params.get("stage-preview"));
  if ([2, 3, 4, 5].includes(stagePreview)) {
    stage = STAGES.find((item) => item.number === stagePreview);
    startStage();
    const world = activeWorld();
    const zoneIndex = clamp(Number(params.get("zone")) - 1 || 0, 0, world.zones.length - 1);
    const zone = world.zones[zoneIndex];
    player.x = zone.x + zone.w / 2;
    player.y = zone.y + zone.h / 2;
    updateCameraTracking(0, true);
  }
  const bossPreview = params.get("boss-preview");
  if (bossPreview) {
    stage = STAGES[0];
    startStage();
    const bossType = bossPreview === "mid" ? "rift-warden" : "chrono-abomination";
    warnings = warnings.filter((item) => item.type !== bossType);
    const point = bossPreview === "mid" ? { x: 930, y: 540 } : { x: 2100, y: 540 };
    spawnEnemy({ x: point.x + 170, y: point.y, type: bossType, elite: true });
    player.x = point.x;
    player.y = point.y;
    camera = WorldCore.updateCamera(camera, point, activeWorld(), view, 1);
  }
}

function exposeLocalQaTools() {
  if (!playtestEnabled) return;
  globalThis.EchoBreachQA = Object.freeze({
    exportPlaytests: () => JSON.parse(JSON.stringify(readPlaytestRuns())),
    summarizePlaytests: () => PlaytestCore.summarizeRuns(readPlaytestRuns()),
  });
}

function showLocalPlaytestReport() {
  if (!playtestEnabled || new URLSearchParams(location.search).get("playtest-report") !== "1")
    return;
  hideAll();
  const panel = document.createElement("section");
  panel.className = "overlay";
  panel.innerHTML = `<div class="panel wide"><p class="eyebrow">로컬 QA</p><h2>Stage 1 플레이 기록</h2><pre id="playtest-report-output"></pre></div>`;
  document.querySelector("main").append(panel);
  $("playtest-report-output").textContent = JSON.stringify(
    {
      summary: PlaytestCore.summarizeRuns(readPlaytestRuns()),
      runs: readPlaytestRuns(),
    },
    null,
    2
  );
}

init();
openLocalUiPreview();
exposeLocalQaTools();
showLocalPlaytestReport();
