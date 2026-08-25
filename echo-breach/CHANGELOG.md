# Changelog

All notable ECHO BREACH changes are recorded here. The project follows Semantic Versioning while it remains a prototype.

## [0.9.2] - 2026-08-25

### Fixed

- Rebuilt hostile Echo movement from first-sample-relative paths with deterministic local scaling, speed-limited motion, and wall-safe targets.
- Added matching cache versions to every local CSS and JavaScript resource and release validation for future version changes.

## [0.9.0] - 2026-08-23

### Added

- Converted Stages 2–5 into continuous camera worlds with distinct gate, rescue, hostile-record, and final-boss rules.
- Added delayed hostile Echo replay and the three-phase PRIME Weaver finale.
- Added adaptive procedural combat, tension, and boss music with saved music/effects volume controls.
- Added the Stage 5 campaign ending and aggregate clear statistics.
- Added twin-stick touch controls and standard gamepad combat/menu controls.

### Tests

- Expanded the deterministic Node regression suite to 98 tests covering audio, campaign completion, touch/gamepad input, five worlds, hostile Echoes, and bosses.

## [0.8.0] - 2026-08-23

### Changed

- Rebuilt title, stage, reward, pause, and combat UI around worn metal surfaces and restrained state colors instead of repeated neon glass cards.
- Added a consistent custom SVG icon vocabulary for stage, weapon, armor, relic, and upgrade presentation.
- Reweighted the HUD around the rewind timer, heavy health bar, compact loadout, tactical minimap, and separate Overdrive meter.
- Made the active stage visually dominant while locked stages remain compact route previews.
- Localized remaining interaction labels and added localhost-only reward UI preview routes for visual QA.

### Accessibility

- Preserved keyboard focus outlines, two-line choice descriptions, reduced-motion behavior, and non-color slot silhouettes.

## [0.7.1] - 2026-08-23

### Changed

- Rewrote all nine upgrade and nine equipment descriptions as concise Korean effect summaries with decision-critical values.
- Localized equipment names, slots, categories, rarities, advantages, drawbacks, empty states, pause help, and reward guidance.
- Moved player-facing choice copy into locale-aware `copy-data.js` with Korean defaults and English fallback structure.
- Standardized choice card heights and limited primary descriptions to two rendered lines.

## [0.7.0] - 2026-08-23

### Added

- Added a responsive combat HUD layout with equipment icons, tooltips, compact objective alerts, and dedicated survival, Anchor, and Overdrive regions.
- Added an enlarged tactical minimap with distinct player, Echo, enemy, relay, and Anchor markers plus offscreen objective guidance.
- Added deterministic floor contamination, cracks, wall depth, and restrained temporal distortion for key combat events.
- Added data-driven stage card colors, silhouettes, route labels, and locked-sector previews.
- Added pure minimap, offscreen-marker, and objective-alert regression tests.

### Accessibility

- Reduced camera shake and strong temporal distortion when `prefers-reduced-motion` is enabled.

## [0.6.0] - 2026-08-23

### Added

- Added a data-driven 3900×1080 continuous Stage 1 world with three connected zones, a time switch, an Echo-operated shortcut, smooth camera tracking, and a compact minimap.
- Added pure camera transforms, zone lookup, and continuous-loop reset regression coverage.

### Changed

- Stage 1 Echo recordings now span the entire world in world coordinates and survive movement between zones.
- Intermediate Stage 1 room transitions and equipment interruptions were removed; equipment remains available after Anchor destruction.
- Loop rewind now restores Stage 1 transient world actors and devices while preserving recordings and cumulative Anchor damage.

## [0.5.0] - 2026-08-23

### Added

- Added data-driven Weapon, Armor, and Temporal Relic slots with nine equipment definitions.
- Added weighted room and Anchor equipment rewards, three-card keyboard-accessible selection, replacement previews, and skip flow.
- Added Chrono Vest shields, Vector Harness dash charges, Hunter Coat shard collection, Echo Lens amplification, Memory Core support fire, and Paradox Ring Overload modifiers.
- Added pure equipment, migration, reward, fire-profile, and Echo snapshot regression coverage.

### Changed

- Fire events now own a serializable deep snapshot of their weapon profile, visual identity, range, penetration, and Anchor modifier.
- Campaign saves migrate from schema 2 to schema 3 while preserving ranks, scores, unlocks, upgrades, difficulty, and mute state.
- First clears now flow from result to equipment recovery, then Chrono Crystal upgrades, then the sector map.

## [0.4.0] - 2026-08-17

### Added

- Added three sequential Stage 1 combat rooms with locked exits and room-scoped Echo recordings.
- Added CHRONO LEECH, CORE GUARD, and RIFT BLOATER behaviors.
- Added collectible Chrono Shards and eight-second Temporal Overdrive.
- Added staged Anchor damage presentation and configurable Temporal Overload cooperation.

### Changed

- Reduced Stage 1–3 objectives to two required relays from data-driven one-to-four relay configurations.
- Changed Split Shot to two 70% projectiles at plus/minus five degrees.

## [0.3.0] - 2026-08-17

### Added

- Added walking, dash lean, and weapon recoil animation to human ECHO-07 agents and Echoes.
- Clarified the human agents as eight-direction top-down silhouettes with continuous weapon aim and hit reactions.
- Distinguished RIFT HOUND, SPORE CASTER, and ANCHOR BRUTE silhouettes and hit/death feedback.
- Converted Stages 1–3 to data-driven connected rooms, walls, passages, and safe spawn points.
- Added monster balance and room reachability regression tests.

### Preserved

- Kept Echo world coordinates, monster combat stats, automatic-fire cadence, and save schema v2.

### Fixed

- Prevented players and monsters from sticking to vertical or horizontal walls.
- Prevented high-speed dashes from tunneling through closed walls.
- Safely expel actors caught inside the Stage 2 gate when it closes.

## [0.2.0] - 2026-08-17

### Changed

- Replaced click-to-fire with automatic fire toward the mouse while the pointer is inside the arena.
- Increased the base fire interval from 0.115 seconds to 0.22 seconds.
- Reduced Split Shot damage per projectile from 70% to 45% while retaining three projectiles.
- Redesigned Charge Lance to charge and release automatically.
- Redrew ECHO-07 as a human agent and enemies as organic time-corruption monsters.
- Added a distinct white hit flash and more expressive monster silhouettes.

### Tests

- Added automatic-fire state gating coverage for play, pause, transition, pointer exit, and death.

## [0.1.0] - 2026-08-17

### Added

- Three-stage ECHO-07 campaign prototype.
- Time-based movement, aim, shot, dash, and Charge Lance Echo replay.
- STORY, OPERATIVE, and PARADOX difficulty configurations.
- Campaign persistence schema version 2 and nine campaign upgrades.
- Shared Echo core module and automated regression coverage.

### Development

- Reproducible Prettier configuration and npm project checks.
- Release metadata, QA baseline, and GitHub Pages verification foundation.
