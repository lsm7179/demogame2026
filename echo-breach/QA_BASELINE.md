# ECHO BREACH QA Baseline

Recorded: 2026-08-17  
Revision: `45200a6` (`main`, matching `origin/main`)  
Runtime: local static server, Codex in-app Chromium browser

This document records the observable and source-defined behavior before the technical-debt cleanup. It is a regression contract, not a proposed balance change.

## Repository baseline

- Working tree was clean before this document was created.
- Remote: `origin` → `https://github.com/lsm7179/demogame2026.git`.
- GitHub Pages workflow uploads only `echo-breach/`.
- `signal-keeper/` is outside the change scope.

## Browser flow baseline

Verified without console errors or warnings:

1. Title screen renders `CONTINUE`, `NEW CAMPAIGN`, controls, and sound state.
2. New campaign opens difficulty selection.
3. OPERATIVE opens the stage map with Stage 1 unlocked and Stages 2–5 locked.
4. Stage 1 briefing displays the NEXUS message and relay objective.
5. Deployment starts the Stage 1 arena and HUD.
6. Mouse aiming/shooting, keyboard movement, dash, early loop recording, pause, and mute inputs respond.
7. Dash stock drops to 0% immediately after use.
8. An early loop record produces active Echo playback on a following loop.
9. `Esc` displays the pause overlay.
10. `M` changes the in-game mute label to `M×`.

## Balance contract

### Difficulty configuration

| Setting | STORY | OPERATIVE | PARADOX |
|---|---:|---:|---:|
| Loop time | 25 s | 20 s | 18 s |
| Maximum loops | 6 | 5 | 5 |
| Enemy bullet speed multiplier | 0.80 | 1.00 | 1.18 |
| Player damage taken multiplier | 0.70 | 1.00 | 1.08 |
| Dash cooldown multiplier | 0.82 | 1.00 | 1.00 |
| Relay decay multiplier | 0.60 | 1.00 | 1.35 |
| Shield-open duration | 6.2 s | 5.3 s | 4.4 s |
| Enemy composition multiplier | 1.00 | 1.00 | 1.25 |
| Score multiplier | 0.80 | 1.00 | 1.35 |

### Base combat configuration

| Value | Baseline |
|---|---:|
| Canvas simulation size | 1280 × 720 |
| Position/aim sample interval | 0.05 s |
| Maximum Echo count | 4 |
| Player maximum health | 100 |
| Player movement speed | 265 px/s |
| Player base damage | 12 |
| Base fire interval | 0.115 s |
| Player bullet speed | 760 px/s |
| Default Echo damage ratio | 0.65 |
| Amplified Echo damage ratio | 0.80 |
| Dash speed | 720 px/s |
| Dash duration | 0.14 s |
| Base dash cooldown | 1.35 s |
| Dash invulnerability | 0.22 s |
| Relay maximum charge | 100 |
| Relay charge per hit | 12 |
| Base relay decay | 8/s |
| Base shield-open duration | 5.3 s |

### Stage and rank configuration

| Stage | Chrono Anchor HP | S | A | B | C |
|---|---:|---:|---:|---:|---|
| 1 — AWAKENING | 650 | 900 | 720 | 520 | below B |
| 2 — SPLIT CURRENT | 720 | 980 | 760 | 540 | below B |
| 3 — RESCUE WINDOW | 760 | 1050 | 800 | 570 | below B |

## Echo recording contract

- Position and aim snapshots use elapsed loop time and a 50 ms target interval.
- Replay interpolates between neighboring snapshots using elapsed loop time.
- Shot events store the complete shot profile: weapon, angle, count, spread, damage, pierce, size, speed, and charge.
- Dash events store elapsed time and direction.
- Completed recordings are capped at four.
- Echoes are not enemy targets and do not receive player damage handling.
- Extended Memory adds two seconds of post-record firing when that upgrade is owned.

## Persistence contract

- localStorage key: `echoBreachCampaign`
- Save version: `2`
- Stored fields: `version`, `difficulty`, `unlockedStage`, `stages`, `upgrades`, `muted`, `hasCampaign`
- Missing, malformed, or version-mismatched data falls back to defaults.
- Unknown upgrade IDs are filtered while valid IDs remain compatible.

## Known manual-test limits

- This baseline did not complete all three stages.
- Long-duration Echo drift, every upgrade combination, and cross-browser behavior remain manual QA items.
