# Changelog

All notable ECHO BREACH changes are recorded here. The project follows Semantic Versioning while it remains a prototype.

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
