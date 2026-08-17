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
  FIRE_RATE: 0.22,
  BULLET_SPEED: 760,
  PLAYER_DAMAGE: 12,
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
    difficulty: { coreHp: 650 },
    relays: { count: 3, moving: false },
    waves: [["chaser", "shooter", "blocker"]],
    objective: "anchor",
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
    difficulty: { coreHp: 720 },
    relays: { count: 3, moving: true },
    waves: [["shooter", "chaser", "blocker", "shooter"]],
    objective: "gate",
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
    difficulty: { coreHp: 760 },
    relays: { count: 3, moving: false },
    waves: [["chaser", "shooter", "chaser", "blocker"]],
    objective: "rescue",
    unlock: 3,
    rewards: ["hull", "time", "weapon"],
    ranks: { S: 1050, A: 800, B: 570 },
  },
  {
    id: "corrupted-record",
    number: 4,
    name: "CORRUPTED RECORD",
    subtitle: "Hostile Memory Vault",
    briefing: ["적대적 기록 신호 감지."],
    arena: { type: "locked" },
    difficulty: {},
    relays: {},
    waves: [],
    objective: "future",
    unlock: 4,
    rewards: [],
    ranks: { S: 1, A: 1, B: 1 },
    locked: true,
  },
  {
    id: "prime-anchor",
    number: 5,
    name: "PRIME ANCHOR",
    subtitle: "Central AI Core",
    briefing: ["중앙 AI 접속 대기."],
    arena: { type: "locked" },
    difficulty: {},
    relays: {},
    waves: [],
    objective: "future",
    unlock: 5,
    rewards: [],
    ranks: { S: 1, A: 1, B: 1 },
    locked: true,
  },
];
const UPGRADES = [
  {
    id: "split-shot",
    name: "SPLIT SHOT",
    category: "WEAPON",
    description: "3방향 사격. 탄환 피해 70%. 릴레이 동기화 범위가 넓어진다.",
    rarity: "rare",
    incompatible: ["pulse-cannon", "charge-lance"],
    visual: "TRIPLE MUZZLE",
  },
  {
    id: "pulse-cannon",
    name: "PULSE CANNON",
    category: "WEAPON",
    description: "발사 속도 38% 감소. 관통하는 고출력 탄환.",
    rarity: "rare",
    incompatible: ["split-shot", "charge-lance"],
    visual: "HEAVY BOLT",
  },
  {
    id: "charge-lance",
    name: "CHARGE LANCE",
    category: "WEAPON",
    description: "누르고 충전, 놓아서 발사. 완충 시 적과 릴레이 관통.",
    rarity: "epic",
    incompatible: ["split-shot", "pulse-cannon"],
    visual: "CHARGE RING",
  },
  {
    id: "echo-amplifier",
    name: "ECHO AMPLIFIER",
    category: "TIME",
    description: "Echo 피해 80%. 현재 기체 피해 92%.",
    rarity: "epic",
    incompatible: [],
    visual: "BRIGHT ECHO",
  },
  {
    id: "extended-memory",
    name: "EXTENDED MEMORY",
    category: "TIME",
    description: "기록 종료 후 마지막 방향으로 2초간 지원 사격.",
    rarity: "rare",
    incompatible: [],
    visual: "AFTERIMAGE HALO",
  },
  {
    id: "record-override",
    name: "RECORD OVERRIDE",
    category: "TIME",
    description: "루프 종료 때 기록 저장 또는 폐기 선택.",
    rarity: "rare",
    incompatible: [],
    visual: "TIMELINE FORK",
  },
  {
    id: "reinforced-hull",
    name: "REINFORCED HULL",
    category: "HULL",
    description: "최대 체력 +35. 이동 속도 -7%.",
    rarity: "common",
    incompatible: [],
    visual: "ARMORED FRAME",
  },
  {
    id: "vector-thruster",
    name: "VECTOR THRUSTER",
    category: "HULL",
    description: "대시 충전 2개. 각 대시 거리는 12% 감소.",
    rarity: "rare",
    incompatible: [],
    visual: "TWIN THRUSTERS",
  },
  {
    id: "emergency-rewind",
    name: "EMERGENCY REWIND",
    category: "HULL",
    description: "스테이지당 한 번, 치명상 시 2초 전 위치로 귀환.",
    rarity: "epic",
    incompatible: [],
    visual: "REWIND CORE",
  },
];
const SAVE_KEY = "echoBreachCampaign",
  SAVE_VERSION = 2;

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
  "upgrade",
].reduce((o, n) => ((o[n] = $(n + "-screen")), o), {});
const ui = {
  hud: $("hud"),
  stage: $("stage-hud"),
  loop: $("loop-value"),
  time: $("time-value"),
  echoes: $("echo-value"),
  hp: $("hp-bar"),
  dash: $("dash-bar"),
  core: $("core-bar"),
  score: $("score-value"),
  objective: $("objective"),
  tip: $("tip"),
  shuttleHud: $("shuttle-hud"),
  shuttle: $("shuttle-bar"),
  survivors: $("survivor-value"),
  muteTitle: $("mute-title"),
  muteGame: $("mute-game"),
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
  shuttle = null,
  enemies = [],
  bullets = [],
  particles = [],
  warnings = [],
  echoes = [],
  recordings = [];
let raf = 0,
  last = 0,
  accumulator = 0,
  shake = 0,
  flash = 0,
  hitStop = 0,
  transitionTimer = 0,
  audio = null,
  muted = save.muted,
  view = { scale: 1, ox: 0, oy: 0 };
const keys = Object.create(null),
  mouse = { x: 640, y: 360, inside: false };
function freshState() {
  return {
    mode: "title",
    loop: 1,
    elapsed: 0,
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
    noHit: true,
    shieldTimer: 0,
    ending: false,
    charge: 0,
    charging: false,
    emergencyUsed: false,
    shuttleHp: 260,
    history: [],
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
  return {
    weapon,
    maxHp: BASE.PLAYER_HP + (has("reinforced-hull") ? 35 : 0),
    speed: BASE.PLAYER_SPEED * (has("reinforced-hull") ? 0.93 : 1),
    playerDamage: BASE.PLAYER_DAMAGE * (has("echo-amplifier") ? 0.92 : 1),
    echoRatio: has("echo-amplifier") ? 0.8 : 0.65,
    fireRate: BASE.FIRE_RATE * (has("pulse-cannon") ? 1.62 : 1),
    dashCd: BASE.DASH_CD * diff.dashCd,
    dashCharges: has("vector-thruster") ? 2 : 1,
    dashTime: BASE.DASH_TIME * (has("vector-thruster") ? 0.88 : 1),
    extended: has("extended-memory"),
    override: has("record-override"),
    emergency: has("emergency-rewind"),
  };
}

// ── 안전한 캠페인 저장 ─────────────────────────────────────────────────────
function defaultSave() {
  return {
    version: SAVE_VERSION,
    difficulty: "operative",
    unlockedStage: 1,
    stages: {},
    upgrades: [],
    muted: false,
    hasCampaign: false,
  };
}
function loadSave() {
  try {
    const x = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!x || x.version !== SAVE_VERSION || !Array.isArray(x.upgrades)) return defaultSave();
    return {
      ...defaultSave(),
      ...x,
      stages: x.stages && typeof x.stages === "object" ? x.stages : {},
      upgrades: x.upgrades.filter((id) => UPGRADES.some((u) => u.id === id)),
    };
  } catch {
    return defaultSave();
  }
}
function persist() {
  save.muted = muted;
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
  });
  addEventListener("keyup", (e) => (keys[e.code] = false));
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left - view.ox) / view.scale;
    mouse.y = (e.clientY - r.top - view.oy) / view.scale;
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
}
function initAudio() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === "suspended") audio.resume();
}
function tone(type, freq, duration = 0.08, volume = 0.05, slide = 0) {
  if (muted || !audio) return;
  const t = audio.currentTime,
    o = audio.createOscillator(),
    g = audio.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + duration);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  o.connect(g).connect(audio.destination);
  o.start(t);
  o.stop(t + duration);
}
const sfx = {
  shot: () => tone("square", 210, 0.045, 0.03, -60),
  echo: () => tone("sine", 520, 0.055, 0.02, -180),
  hurt: () => tone("sawtooth", 85, 0.18, 0.09, -40),
  dash: () => tone("triangle", 360, 0.12, 0.05, 500),
  relay: () => tone("sine", 520, 0.28, 0.06, 500),
  shield: () => tone("sawtooth", 180, 0.42, 0.07, 680),
  loop: () => tone("square", 170, 0.34, 0.06, -110),
  win: () =>
    [330, 440, 660].forEach((f, i) => setTimeout(() => tone("sine", f, 0.4, 0.07, 180), i * 120)),
  lose: () => tone("sawtooth", 180, 0.7, 0.07, -120),
};
function toggleMute() {
  muted = !muted;
  ui.muteTitle.textContent = `SOUND: ${muted ? "OFF" : "ON"}`;
  ui.muteGame.textContent = muted ? "M×" : "M";
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
function norm(x, y) {
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}
function hit(a, b) {
  const r = a.r + b.r;
  return dist2(a, b) < r * r;
}
function poly(x, y, r, n, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i * Math.PI * 2) / n;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
}
function constrain(o, oldX) {
  o.x = clamp(o.x, 42, BASE.W - 42);
  o.y = clamp(o.y, 55, BASE.H - 42);
  for (const w of walls) {
    if (w.open) continue;
    if (o.x + o.r > w.x && o.x - o.r < w.x + w.w && o.y + o.r > w.y && o.y - o.r < w.y + w.h) {
      o.x = oldX < w.x ? w.x - o.r : w.x + w.w + o.r;
    }
  }
}
function randomEdge() {
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
  return {
    x: stage.number === 2 ? 220 : 640,
    y: 630,
    r: 15,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    hp: stats.maxHp,
    fireCd: 0,
    dashCd: 0,
    dashStock: stats.dashCharges,
    dashLeft: 0,
    invuln: 0,
  };
}
function updatePlayer(dt) {
  let ix = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0),
    iy = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0),
    n = norm(ix, iy);
  if (!ix && !iy) n = { x: 0, y: 0 };
  const blend = 1 - Math.exp(-BASE.ACCEL * dt);
  player.vx = lerp(player.vx, n.x * stats.speed, blend);
  player.vy = lerp(player.vy, n.y * stats.speed, blend);
  const ox = player.x;
  if (player.dashLeft > 0) {
    player.dashLeft -= dt;
    player.x += player.dashX * BASE.DASH_SPEED * dt;
    player.y += player.dashY * BASE.DASH_SPEED * dt;
    trail(player, "#ffb45d");
  } else {
    player.x += player.vx * dt;
    player.y += player.vy * dt;
  }
  constrain(player, ox);
  player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  player.fireCd -= dt;
  player.invuln -= dt;
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
    mouseInside: mouse.inside,
    alive: player.hp > 0,
  });
  if (stats.weapon === "charge") {
    state.charging = autoFire;
    if (autoFire) {
      state.charge = Math.min(1.25, state.charge + dt);
      if (state.charge >= 1.25) releaseCharge(false);
    }
  } else if (autoFire && player.fireCd <= 0) {
    fireWeapon(player, false, makeShotProfile(player.angle));
  }
  recordSnapshot();
  state.history.push({ t: state.elapsed, x: player.x, y: player.y });
  while (state.history.length && state.history[0].t < state.elapsed - 2.2) state.history.shift();
}
function makeShotProfile(angle, charge = 0) {
  let p = {
    weapon: stats.weapon,
    a: angle,
    count: 1,
    spread: 0,
    damage: stats.playerDamage,
    pierce: 0,
    size: 3,
    speed: BASE.BULLET_SPEED,
    charge,
  };
  if (stats.weapon === "split")
    Object.assign(p, { count: 3, spread: 0.16, damage: stats.playerDamage * 0.45 });
  if (stats.weapon === "pulse")
    Object.assign(p, { damage: stats.playerDamage * 1.55, pierce: 3, size: 6, speed: 650 });
  if (stats.weapon === "charge")
    Object.assign(p, {
      damage: stats.playerDamage * (0.7 + charge * 1.65),
      pierce: charge >= 0.82 ? 5 : 0,
      size: 4 + charge * 5,
      speed: 680 + charge * 160,
    });
  return p;
}
function fireWeapon(owner, isEcho, profile, record = true) {
  owner.fireCd = stats.fireRate;
  for (let i = 0; i < profile.count; i++) {
    const off = (i - (profile.count - 1) / 2) * profile.spread,
      a = profile.a + off,
      c = Math.cos(a),
      s = Math.sin(a),
      ratio = isEcho ? stats.echoRatio : 1;
    bullets.push({
      x: owner.x + c * 22,
      y: owner.y + s * 22,
      px: owner.x,
      py: owner.y,
      vx: c * profile.speed,
      vy: s * profile.speed,
      r: profile.size,
      life: 1.4,
      team: "player",
      echo: isEcho,
      damage: profile.damage * ratio,
      pierce: profile.pierce,
    });
  }
  if (!isEcho && record)
    state.current.events.push({ t: state.elapsed, type: "shot", profile: { ...profile } });
  (isEcho ? sfx.echo : sfx.shot)();
  burst(
    owner.x + Math.cos(profile.a) * 22,
    owner.y + Math.sin(profile.a) * 22,
    isEcho ? "#45f5e9" : "#ffd39a",
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
  if (player.hp - dmg <= 0 && stats.emergency && !state.emergencyUsed && state.history.length) {
    const h = state.history[0];
    player.x = h.x;
    player.y = h.y;
    player.hp = Math.max(28, stats.maxHp * 0.3);
    player.invuln = 1;
    state.emergencyUsed = true;
    burst(player.x, player.y, "#45f5e9", 30, 240);
    tone("sine", 250, 0.5, 0.08, 700);
    return;
  }
  player.hp -= dmg;
  state.damageTaken += dmg;
  state.noHit = false;
  player.invuln = 0.45;
  shake = 12;
  flash = 0.22;
  hitStop = 0.04;
  sfx.hurt();
  burst(player.x, player.y, "#ff4f67", 18, 210);
  if (player.hp <= 0) endLoop("death");
}

// ── Echo 기록과 재생 ───────────────────────────────────────────────────────
function beginRecording() {
  state.current = { samples: [], events: [], alive: true, duration: 0, weapon: stats.weapon };
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
  };
}
function updateEchoes(dt) {
  for (const e of echoes) {
    const t = state.elapsed,
      extra = stats.extended ? 2 : 0;
    if (t > e.rec.duration + extra) {
      e.finished = true;
      continue;
    }
    e.finished = false;
    if (t <= e.rec.duration) {
      const pose = EchoCore.interpolatePose(e.rec.samples, t);
      e.x = pose.x;
      e.y = pose.y;
      e.angle = pose.angle;
      const due = EchoCore.collectDueEvents(e.rec.events, e.eventIndex, t);
      e.eventIndex = due.nextIndex;
      for (const ev of due.events) {
        if (ev.type === "shot") fireWeapon(e, true, ev.profile, false);
        else if (ev.type === "dash") burst(e.x, e.y, "#45f5e9", 7, 80);
      }
    } else if (stats.extended) {
      e.extendedCd -= dt;
      if (e.extendedCd <= 0) {
        fireWeapon(e, true, makeShotProfile(e.angle), false);
        e.extendedCd = 0.22;
      }
    }
    if (Math.random() < 0.3) trail(e, "#45f5e9");
  }
}

// ── 총알, 적, Stage 3 구조선 ────────────────────────────────────────────────
function enemyStats(type) {
  return type === "chaser"
    ? { r: 15, hp: 30, speed: 92, score: 120 }
    : type === "shooter"
      ? { r: 18, hp: 46, speed: 62, score: 180 }
      : { r: 23, hp: 95, speed: 48, score: 240 };
}
function queueEnemies() {
  warnings = [];
  let source = stage.waves[0],
    count = Math.ceil((3 + state.loop) * diff.enemyMix);
  for (let i = 0; i < count; i++) {
    const p = randomEdge(),
      type = source[i % source.length];
    warnings.push({
      ...p,
      type,
      timer: 0.7 + i * 0.23,
      targetShuttle: stage.number === 3 && i % 3 === 0,
    });
  }
}
function spawnEnemy(w) {
  const q = enemyStats(w.type);
  enemies.push({
    ...w,
    r: q.r,
    hp: q.hp,
    maxHp: q.hp,
    speed: q.speed,
    score: q.score,
    alive: true,
    fire: 1 + Math.random(),
    touch: 0,
    wobble: Math.random() * 6.28,
    hitFlash: 0,
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
    damage: 12,
    targetShuttle: e.targetShuttle,
  });
}
function updateEnemies(dt) {
  for (const e of enemies) {
    if (!e.alive) continue;
    e.touch -= dt;
    e.fire -= dt;
    e.wobble += dt;
    e.hitFlash = Math.max(0, e.hitFlash - dt);
    const target = e.targetShuttle && shuttle && shuttle.hp > 0 ? shuttle : player;
    let tx = target.x,
      ty = target.y;
    if (e.type === "shooter") {
      const d = Math.hypot(target.x - e.x, target.y - e.y),
        dir = d < 245 ? -1 : d > 360 ? 1 : 0;
      tx = e.x + (target.x - e.x) * dir;
      ty = e.y + (target.y - e.y) * dir + Math.sin(e.wobble) * 40;
      if (e.fire <= 0 && d < 540) {
        enemyShoot(e, target);
        e.fire = 1.65;
      }
    }
    if (e.type === "blocker") {
      const r = relays.reduce((a, b) => (dist2(e, b) < dist2(e, a) ? b : a), relays[0]);
      const n = norm(player.x - r.x, player.y - r.y);
      tx = r.x + n.x * 48;
      ty = r.y + n.y * 48;
    }
    if (e.type === "chaser") {
      tx += Math.sin(e.wobble) * 32;
      ty += Math.cos(e.wobble * 0.8) * 32;
    }
    const n = norm(tx - e.x, ty - e.y),
      ox = e.x;
    e.x += n.x * e.speed * dt;
    e.y += n.y * e.speed * dt;
    constrain(e, ox);
    if (target === player && hit(e, player) && e.touch <= 0) {
      hurtPlayer(e.type === "blocker" ? 16 : 10, e);
      e.touch = 0.7;
    } else if (target === shuttle && hit(e, shuttle) && e.touch <= 0) {
      hurtShuttle(e.type === "blocker" ? 18 : 11);
      e.touch = 0.8;
    }
  }
}
function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.px = b.x;
    b.py = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    let gone = b.life <= 0 || b.x < 0 || b.x > BASE.W || b.y < 0 || b.y > BASE.H;
    if (
      !gone &&
      walls.some((w) => !w.open && b.x > w.x && b.x < w.x + w.w && b.y > w.y && b.y < w.y + w.h)
    ) {
      spark(b.x, b.y, "#659cff");
      gone = true;
    }
    if (!gone && b.team === "enemy") {
      if (b.targetShuttle && shuttle && shuttle.hp > 0 && hit(b, shuttle)) {
        hurtShuttle(b.damage);
        gone = true;
      } else if (hit(b, player)) {
        hurtPlayer(b.damage, b);
        gone = true;
      }
    }
    if (!gone && b.team === "player") {
      for (const e of enemies)
        if (e.alive && hit(b, e)) {
          damageEnemy(e, b.damage, b.echo);
          if (b.pierce-- <= 0) gone = true;
          break;
        }
      if (!gone)
        for (const s of switches)
          if (hit(b, s)) {
            s.charge = Math.min(100, s.charge + 16);
            s.lastHit = state.elapsed;
            if (b.pierce-- <= 0) gone = true;
            break;
          }
      if (!gone)
        for (const r of relays)
          if (hit(b, r)) {
            r.charge = Math.min(100, r.charge + BASE.RELAY_GAIN);
            r.lastHit = state.elapsed;
            if (b.pierce-- <= 0) gone = true;
            break;
          }
      if (!gone && hit(b, core)) {
        if (state.shieldTimer > 0) {
          damageCore(b.damage, b.echo);
          burst(b.x, b.y, "#fff", 6, 85);
        } else spark(b.x, b.y, "#69a6ff");
        gone = true;
      }
    }
    if (gone) bullets.splice(i, 1);
  }
}
function damageEnemy(e, dmg, byEcho) {
  e.hp -= dmg;
  e.hitFlash = 0.09;
  burst(e.x, e.y, "#ff3f63", 5, 100);
  if (e.hp <= 0) {
    e.alive = false;
    state.kills++;
    state.combo = state.elapsed - state.lastKill < 2.2 ? state.combo + 1 : 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.score += e.score + state.combo * 20;
    if (byEcho) state.echoDamage += e.maxHp;
    state.lastKill = state.elapsed;
    burst(e.x, e.y, "#ff4c70", 18, 200);
  }
}
function hurtShuttle(dmg) {
  if (!shuttle || shuttle.hp <= 0) return;
  shuttle.hp = Math.max(0, shuttle.hp - dmg);
  state.shuttleHp = shuttle.hp;
  shuttle.survivors = Math.ceil((12 * shuttle.hp) / shuttle.maxHp);
  shake = 5;
  burst(shuttle.x, shuttle.y, "#79dcff", 10, 130);
}

// ── 릴레이, 장벽, Chrono Anchor ────────────────────────────────────────────
function makeObjectives() {
  const hp = core?.hp ?? stage.difficulty.coreHp,
    c = {
      x: stage.number === 2 ? 990 : 640,
      y: stage.number === 3 ? 250 : 335,
      r: 46,
      hp,
      maxHp: stage.difficulty.coreHp,
    };
  let pos =
    stage.number === 2
      ? [
          [770, 170],
          [1060, 500],
          [830, 520],
        ]
      : stage.number === 3
        ? [
            [430, 210],
            [850, 210],
            [640, 455],
          ]
        : [
            [640, 130],
            [820, 440],
            [460, 440],
          ];
  return {
    c,
    rs: pos.map((p, i) => ({
      x: p[0],
      y: p[1],
      baseX: p[0],
      baseY: p[1],
      r: 30,
      charge: 0,
      active: false,
      lastHit: -9,
      index: i,
      moving: stage.relays.moving && i === 1,
    })),
  };
}
function buildArena() {
  walls = [];
  switches = [];
  shuttle = null;
  if (stage.number === 2) {
    walls = [
      { x: 620, y: 45, w: 40, h: 235, open: false },
      { x: 620, y: 440, w: 40, h: 235, open: false },
      { x: 620, y: 280, w: 40, h: 160, open: false, gate: true },
    ];
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
function updateObjectives(dt) {
  for (const s of switches) {
    if (state.elapsed - s.lastHit > 0.18)
      s.charge = Math.max(0, s.charge - 13 * diff.relayDecay * dt);
    const gate = walls.find((w) => w.gate);
    if (gate) gate.open = s.charge >= 42;
  }
  for (const r of relays) {
    if (r.moving) {
      r.x = r.baseX + Math.sin(state.elapsed * 0.75) * 90;
      r.y = r.baseY + Math.sin(state.elapsed * 1.5) * 28;
    }
    const was = r.active;
    if (state.elapsed - r.lastHit > 0.18)
      r.charge = Math.max(0, r.charge - BASE.RELAY_DECAY * diff.relayDecay * dt);
    r.active = r.charge >= BASE.RELAY_MAX;
    if (r.active && !was) {
      state.score += 250;
      sfx.relay();
      burst(r.x, r.y, "#b88cff", 20, 140);
    }
  }
  if (relays.every((r) => r.active) && state.shieldTimer <= 0) {
    state.shieldTimer = diff.shieldTime;
    state.score += 500 + echoes.length * 100;
    sfx.shield();
    shake = 9;
  }
  state.shieldTimer = Math.max(0, state.shieldTimer - dt);
}
function damageCore(dmg, byEcho) {
  core.hp = Math.max(0, core.hp - dmg);
  state.coreDamage += dmg;
  state.totalCoreHits++;
  if (byEcho) {
    state.echoCoreHits++;
    state.echoDamage += dmg;
  }
  state.score += Math.round(dmg * 5);
  shake = 3;
  if (core.hp <= 0) endStage(true);
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
  bullets = [];
  particles = [];
  enemies = [];
  const o = makeObjectives();
  core = o.c;
  relays = o.rs;
  buildArena();
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
  hideAll();
  ui.hud.classList.remove("hidden");
  ui.muteGame.classList.remove("hidden");
  last = performance.now();
  accumulator = 0;
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
  screens.transition.classList.add("hidden");
  resetLoopWorld();
  last = performance.now();
}
function calculateRank(win) {
  const sync = state.totalCoreHits ? state.echoCoreHits / state.totalCoreHits : 0,
    rescue = shuttle ? shuttle.survivors / 12 : 1;
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
        ? `생존자 ${shuttle.survivors}/12`
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
  hideAll();
  screens.result.classList.remove("hidden");
  $("result-kicker").textContent = win ? "ANCHOR COLLAPSED // TIME RESTORED" : "TEMPORAL LOCKDOWN";
  $("result-title").textContent = win ? `${stage.name} CLEAR` : "BREACH FAILED";
  $("rank-badge").textContent = rank.rank;
  $("rank-reasons").textContent = rank.reasons.join(" · ");
  $("result-score").textContent = final;
  $("result-loops").textContent = `${state.loop} / ${diff.maxLoops}`;
  $("result-sync").textContent = `${Math.round(rank.sync * 100)}%`;
  $("result-hurt").textContent = Math.round(state.damageTaken);
  $("result-rescue").textContent = shuttle ? `${shuttle.survivors} / 12` : "—";
  $("result-combo").textContent = state.bestCombo;
  $("result-next").textContent = win ? "ANALYZE CRYSTAL" : "RETRY";
  if (win) {
    const old = save.stages[stage.id] || {};
    save.stages[stage.id] = {
      score: Math.max(old.score || 0, final),
      rank: betterRank(old.rank, rank.rank),
    };
    save.unlockedStage = Math.max(save.unlockedStage, Math.min(3, stage.number + 1));
    save.hasCampaign = true;
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
    `${DIFFICULTIES[save.difficulty].name} // UPGRADES ${save.upgrades.length}/9`;
  $("stage-cards").innerHTML = STAGES.map((s) => {
    const locked = s.locked || s.number > save.unlockedStage,
      r = save.stages[s.id];
    return `<button class="card ${locked ? "locked" : ""}" data-stage="${s.id}" ${locked ? "disabled" : ""}><span class="num">STAGE 0${s.number}</span>${r ? `<b class="rank">${r.rank}</b>` : ""}<h3>${s.name}</h3><p>${s.subtitle}</p><span class="tag">${locked ? "LOCKED" : s.objective.toUpperCase()}</span></button>`;
  }).join("");
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
      ? "3개 릴레이 동시 동기화 → Chrono Anchor 파괴"
      : s.number === 2
        ? "Echo로 스위치 사격 유지 → 장벽 통과 → 이동 릴레이 동기화"
        : "탈출선 호위 기록 → 릴레이 동기화 → Anchor 파괴";
}
function upgradeCandidates() {
  const owned = new Set(save.upgrades),
    blocked = new Set(UPGRADES.filter((u) => owned.has(u.id)).flatMap((u) => u.incompatible));
  return UPGRADES.filter((u) => !owned.has(u.id) && !blocked.has(u.id))
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
    .map(
      (u) =>
        `<button class="card rarity-${u.rarity}" data-upgrade="${u.id}"><span class="num">${u.category} // ${u.rarity.toUpperCase()}</span><h3>${u.name}</h3><p>${u.description}</p><p class="statline">${u.visual}</p></button>`
    )
    .join("");
}
function updateHUD() {
  ui.stage.textContent = `S${stage.number} // ${stage.name}`;
  ui.loop.textContent = `${state.loop} / ${diff.maxLoops}`;
  ui.time.textContent = Math.max(0, diff.loopTime - state.elapsed).toFixed(1);
  ui.echoes.textContent = echoes.length;
  ui.hp.style.width = `${100 * clamp(player.hp / stats.maxHp, 0, 1)}%`;
  ui.dash.style.width = `${100 * (player.dashStock / stats.dashCharges)}%`;
  ui.core.style.width = `${(100 * core.hp) / core.maxHp}%`;
  ui.score.textContent = Math.round(state.score);
  ui.shuttleHud.classList.toggle("hidden", !shuttle);
  if (shuttle) {
    ui.shuttle.style.width = `${(100 * shuttle.hp) / shuttle.maxHp}%`;
    ui.survivors.textContent = `${shuttle.survivors} / 12`;
  }
  const gate = walls.find((w) => w.gate);
  ui.objective.textContent =
    state.shieldTimer > 0
      ? `ANCHOR EXPOSED // ${state.shieldTimer.toFixed(1)}s`
      : stage.number === 2 && gate && !gate.open
        ? "KEEP SWITCH CHARGED — OPEN THE GATE"
        : relays.some((r) => r.active)
          ? `${relays.filter((r) => r.active).length} / 3 RELAYS SYNCHRONIZED`
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
  ctx.save();
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.translate(view.ox + (Math.random() - 0.5) * shake, view.oy + (Math.random() - 0.5) * shake);
  ctx.scale(view.scale, view.scale);
  renderArena();
  if (player) {
    renderObjectives();
    renderWarnings();
    renderParticles();
    renderBullets();
    renderEnemies();
    renderEchoes();
    renderActor(player, false);
    renderCursor();
  }
  ctx.restore();
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
}
function renderArena() {
  ctx.fillStyle = stage?.arena?.tint || "#060916";
  ctx.fillRect(0, 0, BASE.W, BASE.H);
  ctx.strokeStyle = "rgba(66,95,142,.12)";
  for (let x = 0; x < BASE.W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, BASE.H);
    ctx.stroke();
  }
  for (let y = 0; y < BASE.H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(BASE.W, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(76,244,232,.22)";
  ctx.strokeRect(25, 25, BASE.W - 50, BASE.H - 50);
  for (const w of walls) {
    ctx.fillStyle = w.open ? "rgba(69,245,233,.08)" : "rgba(70,116,185,.45)";
    ctx.fillRect(w.x, w.y, w.w, w.h);
    if (w.gate) {
      ctx.strokeStyle = w.open ? "#45f5e9" : "#659cff";
      ctx.strokeRect(w.x, w.y, w.w, w.h);
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
  for (const s of switches) {
    ctx.strokeStyle = "#45f5e9";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r + 7, -Math.PI / 2, -Math.PI / 2 + (s.charge / 100) * 6.283);
    ctx.stroke();
    ctx.fillStyle = "#16474b";
    poly(s.x, s.y, s.r, 4, Math.PI / 4);
    ctx.fill();
  }
  for (const r of relays) {
    const p = r.charge / 100;
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
  ctx.shadowBlur = 24;
  ctx.shadowColor = state.shieldTimer > 0 ? "#ff405f" : "#488bff";
  ctx.fillStyle = "#d92d4d";
  poly(core.x, core.y, 34, 8, performance.now() * 0.0002);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(core.x, core.y, 10, 0, 6.283);
  ctx.fill();
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
  ctx.rotate(o.angle);
  ctx.globalAlpha = isEcho ? 0.62 : 1;
  ctx.shadowBlur = 15;
  ctx.shadowColor = isEcho ? "#45f5e9" : "#ffb45d";
  const suit = isEcho ? "#45f5e9" : "#f5f8ff";
  const accent = isEcho ? "#77fff5" : "#ffab55";
  ctx.strokeStyle = suit;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-7, 7);
  ctx.lineTo(-11, 17);
  ctx.moveTo(3, 8);
  ctx.lineTo(6, 18);
  ctx.stroke();
  ctx.fillStyle = suit;
  ctx.beginPath();
  ctx.roundRect(-10, -10, 20, 23, 7);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(-1, -15, 7, 0, 6.283);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(2, -5);
  ctx.lineTo(15, -1);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillRect(10, -4, 22, 7);
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
      const color = e.targetShuttle
        ? "#d43f8e"
        : e.type === "blocker"
          ? "#871d3b"
          : e.type === "shooter"
            ? "#ba2949"
            : "#f03b56";
      const pulse = 1 + Math.sin(e.wobble * 4) * 0.06;
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = e.type === "blocker" ? 7 : 4;
      ctx.lineCap = "round";
      for (let i = 0; i < (e.type === "blocker" ? 6 : 4); i++) {
        const a = (i / (e.type === "blocker" ? 6 : 4)) * Math.PI * 2 + e.wobble * 0.25;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * e.r * 0.55, Math.sin(a) * e.r * 0.55);
        ctx.quadraticCurveTo(
          Math.cos(a + 0.35) * e.r,
          Math.sin(a + 0.35) * e.r,
          Math.cos(a) * e.r * 1.35,
          Math.sin(a) * e.r * 1.35
        );
        ctx.stroke();
      }
      ctx.fillStyle = e.hitFlash > 0 ? "#fff" : color;
      ctx.beginPath();
      ctx.ellipse(0, 0, e.r * pulse, e.r * 0.82, e.wobble * 0.1, 0, 6.283);
      ctx.fill();
      ctx.fillStyle = "#fff1f4";
      ctx.beginPath();
      ctx.arc(e.type === "shooter" ? 4 : 0, -2, e.type === "blocker" ? 4 : 3, 0, 6.283);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#ff9aaa";
      ctx.fillRect(e.x - e.r, e.y - e.r - 8, (e.r * 2 * e.hp) / e.maxHp, 3);
    }
}
function renderBullets() {
  ctx.lineCap = "round";
  for (const b of bullets) {
    ctx.strokeStyle = b.team === "enemy" ? "#ff405f" : b.echo ? "rgba(69,245,233,.7)" : "#ffe0a6";
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
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 6.283);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function renderWarnings() {
  for (const w of warnings) {
    ctx.strokeStyle = "#ff3f63";
    ctx.beginPath();
    ctx.arc(w.x, w.y, 22 + (w.timer % 0.25) * 50, 0, 6.283);
    ctx.stroke();
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

// ── 업데이트 루프와 초기화 ─────────────────────────────────────────────────
function update(dt) {
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
  updatePlayer(dt);
  updateEchoes(dt);
  for (let i = warnings.length - 1; i >= 0; i--) {
    warnings[i].timer -= dt;
    if (warnings[i].timer <= 0) {
      spawnEnemy(warnings[i]);
      warnings.splice(i, 1);
    }
  }
  updateEnemies(dt);
  updateBullets(dt);
  updateObjectives(dt);
  updateParticles(dt);
  updateHUD();
  if (state.elapsed >= diff.loopTime) endLoop("time");
}
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
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
  $("keep-record").onclick = () => completeLoop(true);
  $("discard-record").onclick = () => completeLoop(false);
  $("result-map").onclick = showStageSelect;
  $("result-next").onclick = () => {
    if (state.finalRank && state.mode === "result" && core.hp <= 0 && state.firstClear)
      showUpgrades();
    else if (core.hp <= 0) showStageSelect();
    else startStage();
  };
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
}
function init() {
  diff = DIFFICULTIES[save.difficulty] || DIFFICULTIES.operative;
  muted = save.muted;
  renderDifficulties();
  resize();
  bindInputs();
  bindUI();
  addEventListener("resize", resize);
  ui.muteTitle.textContent = `SOUND: ${muted ? "OFF" : "ON"}`;
  render();
}
init();
