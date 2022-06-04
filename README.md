# osu-mania-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-mania-stable)](https://www.codefactor.io/repository/github/kionell/osu-mania-stable)
[![License](https://img.shields.io/github/license/kionell/osu-mania-stable)](https://github.com/kionell/osu-mania-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-mania-stable)](https://www.npmjs.com/package/osu-mania-stable)


osu!stable version of osu!mania ruleset based on osu!lazer source code.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!mania mods.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-mania-stable
```

## Example of converting beatmap to the osu!mania ruleset

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers';
import { ManiaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath, shouldParseSb);

// Create a new osu!mania ruleset.
const ruleset = new ManiaRuleset();

// This will create a new shallow copy of a beatmap with applied osu!mania ruleset.
// This method implicitly applies mod combination of 0.
const maniaWithNoMod = ruleset.applyToBeatmap(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const maniaWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!mania beatmap with no mods.
encoder.encodeToPath(encodePath, maniaWithNoMod);

// It will write osu!mania beatmap with applied mods.
encoder.encodeToPath(encodePath, maniaWithMods);
```

## Example of basic difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { ManiaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!mania ruleset.
const ruleset = new ManiaRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

// You can pass any IBeatmap object to the difficulty calculator.
// Difficulty calculator will implicitly create a new beatmap with osu!mania ruleset.
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);
```

## Example of advanced difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { ManiaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!mania ruleset.
const ruleset = new ManiaRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT
const maniaWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

/**
 * Any IBeatmap object can be used to create difficulty calculator. 
 * Difficulty calculator implicitly applies osu!mania ruleset with no mods.
 */
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);
const difficultyAttributes1 = difficultyCalculator1.calculate(); // no mods.
const moddedAttributes1 = difficultyCalculator1.calculateWithMods(mods); // with mods.

/**
 * If you pass osu!mania beatmap then it will use its ruleset and mods.
 */
const difficultyCalculator2 = ruleset.createDifficultyCalculator(maniaWithMods);
const difficultyAttributes2 = difficultyCalculator2.calculate(); // with mods!
const moddedAttributes2 = difficultyCalculator2.calculateWithMods(mods); // the same as previous line.
```

## Example of performance calculation

```js
import { ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { ManiaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!mania ruleset.
const ruleset = new ManiaRuleset();

// Apply osu!mania ruleset to the beatmap.
const maniaBeatmap = ruleset.applyToBeatmap(parsed);

// Create difficulty calculator for osu!mania beatmap.
const difficultyCalculator = ruleset.createDifficultyCalculator(maniaBeatmap);

// Calculate difficulty attributes with mods.
const mods = ruleset.createModCombination('NC');
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);

// penoreri - Monochrome and Vivid [[7K] New Palettes]
// Jakads + NC 1437.29 pp.
const score = new ScoreInfo({
  rulesetId: 3,
  totalScore: 975283,
  countGeki: 4288, // score.statistics.perfect
  count300: 1180, // score.statistics.great
  countKatu: 57, // score.statistics.good
  count100: 2, // score.statistics.ok
  count50: 0, // score.statistics.meh
  countMiss: 6, // score.statistics.miss
  mods,
});

// Create performance calculator for osu!mania ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate performance attributes for a map.
const performanceAttributes = performanceCalculator.calculateAttributes();

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();

/**
 * Values may differ slightly from osu!stable 
 * as performance calculations are based on osu!lazer code.
 * The main goal of this library is to match 1:1 to osu!lazer values.
 * If you want, you can compare the results with osu-tools.
 */
console.log(totalPerformance); // 1471.4490561186863
```

## Other projects

All projects below are based on this code.

- [osu-parsers](https://github.com/kionell/osu-parsers.git) - A bundle of parsers for different osu! file formats.
- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!standard ruleset based on the osu!lazer source code.
- [osu-taiko-stable](https://github.com/kionell/osu-taiko-stable.git) - The osu!taiko ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-mania-stable/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.