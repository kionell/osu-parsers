# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2021-10-06

### Added

- Beatmap components:
  - A new abstract RulesetBeatmap class for custom ruleset beatmaps.

- Mod components:
  - JSDoc comments for the ModCombination class.

- Ruleset components:
  - Rulesets now contain an ID.

### Changed

- Mod components:
  - A list of all mods of a mod combination is now available via getter.

- Ruleset components:
  - Moved the logic for applying and removing mods to the RulesetBeatmap class.
## [0.1.0] - 2021-04-19

### Added

- Beatmap components:
  - Abstract beatmap class.
  - Beatmap interface for custom beatmap implementations.
  - Beatmap converter.
  - Beatmap processor.

- Mod components:
  - Basic implementation of all osu!stable mods.
  - Support for mod combinations.

- Object components:
  - Abstract hit object class.
  - Hit object interfaces for custom hit object implementations.
  - Nested events & tick generation.

- Ruleset components:
  - Abstract ruleset class.
  - Ruleset interface for custom ruleset implementations.

- Storyboard components:
  - All storyboard elements.
  - All storyboard compounded commands.
  - All storyboard commands.
