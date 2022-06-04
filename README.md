# osu-catch-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-catch-stable)](https://www.codefactor.io/repository/github/kionell/osu-catch-stable)
[![License](https://img.shields.io/github/license/kionell/osu-catch-stable)](https://github.com/kionell/osu-catch-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-catch-stable)](https://www.npmjs.com/package/osu-catch-stable)


osu!stable version of osu!catch ruleset based on osu!lazer source code.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!catch mods.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-catch-stable
```

## Example of converting beatmap to the osu!catch ruleset

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers';
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath, shouldParseSb);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

// This will create a new shallow copy of a beatmap with applied osu!catch ruleset.
// This method implicitly applies mod combination of 0.
const catchWithNoMod = ruleset.applyToBeatmap(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const catchWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!catch beatmap with no mods to a file.
encoder.encodeToPath(encodePath, catchWithNoMod1);

// It will write osu!catch beatmap with applied mods to a file.
encoder.encodeToPath(encodePath, catchWithMods);
```

## Example of basic difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { CatchRuleset } from 'osu-catchstable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catchruleset.
const ruleset = new CatchRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

// You can pass any IBeatmap object to the difficulty calculator.
// Difficulty calculator will implicitly create a new beatmap with osu!catch ruleset.
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);
```


## Example of advanced difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT
const catchWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

/**
 * Any IBeatmap object can be used to create difficulty calculator. 
 * Difficulty calculator implicitly applies osu!catchruleset with no mods.
 */
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);
const difficultyAttributes1 = difficultyCalculator1.calculate(); // no mods.
const moddedAttributes1 = difficultyCalculator1.calculateWithMods(mods); // with mods.

/**
 * If you pass osu!catch beatmap then it will use its ruleset and mods.
 */
const difficultyCalculator2 = ruleset.createDifficultyCalculator(catchWithMods);
const difficultyAttributes2 = difficultyCalculator2.calculate(); // with mods!
const moddedAttributes2 = difficultyCalculator2.calculateWithMods(mods); // the same as previous line.
```

## Example of performance calculation

```js
import { ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

// Apply osu!catch ruleset to the beatmap.
const catchBeatmap = ruleset.applyToBeatmap(parsed);

// Create difficulty calculator for osu!catch beatmap.
const difficultyCalculator = ruleset.createDifficultyCalculator(catchBeatmap);

// Calculate difficulty attributes with mods.
const mods = ruleset.createModCombination('HDHR');
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);

// Kaneko Chiharu - iLLness LiLin [CRYSTAL'S DYSTOPIA]
// YesMyDarknesss + HDHR 1380.09 pp.
const score = new ScoreInfo({
  rulesetId: 2,
  maxCombo: 1420,
  count300: 1358, // score.statistics.great
  count100: 62, // score.statistics.largeTickHit
  count50: 83, // score.statistics.smallTickHit
  countKatu: 2, // score.statistics.smallTickMiss
  countMiss: 0, // score.statistics.misses
  mods,
});

// Create performance calculator for osu!catch ruleset.
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
console.log(totalPerformance); // 1380.0841687636698
```

## Other projects

All projects below are based on this code.

- [osu-parsers](https://github.com/kionell/osu-parsers.git) - A bundle of parsers for different osu! file formats.
- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!standard ruleset based on the osu!lazer source code.
- [osu-taiko-stable](https://github.com/kionell/osu-taiko-stable.git) - The osu!taiko ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-catch-stable/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.