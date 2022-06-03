# osu-standard-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-standard-stable)](https://www.codefactor.io/repository/github/kionell/osu-standard-stable)
[![License](https://img.shields.io/github/license/kionell/osu-standard-stable)](https://github.com/kionell/osu-standard-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-standard-stable)](https://www.npmjs.com/package/osu-standard-stable)


osu!stable version of osu!standard ruleset based on osu!lazer source code.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!standard mods.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-standard-stable
```

## Example of converting beatmap to the osu!std ruleset

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath, shouldParseSb);

// Create a new osu!standard ruleset.
const ruleset = new StandardRuleset();

// This will create a new shallow copy of a beatmap with applied osu!standard ruleset.
// This method implicitly applies mod combination of 0.
const standardWithNoMod = ruleset.applyToBeatmap(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const standardWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!standard beatmap with no mods to a file.
encoder.encodeToPath(encodePath, standardWithNoMod);

// It will write osu!standard beatmap with applied mods to a file.
encoder.encodeToPath(encodePath, standardWithMods);
```

## Example of basic difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!standard ruleset.
const ruleset = new StandardRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

// You can pass any IBeatmap object to the difficulty calculator.
// Difficulty calculator will implicitly create a new beatmap with osu!standard ruleset.
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);
```

## Example of advanced difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!standard ruleset.
const ruleset = new StandardRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT
const standardWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

/**
 * Any IBeatmap object can be used to create difficulty calculator. 
 * Difficulty calculator implicitly applies osu!standard ruleset with no mods.
 */
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);
const difficultyAttributes1 = difficultyCalculator1.calculate(); // no mods.
const moddedAttributes1 = difficultyCalculator1.calculateWithMods(mods); // with mods.

/**
 * If you pass osu!standard beatmap then it will use its ruleset and mods.
 */
const difficultyCalculator2 = ruleset.createDifficultyCalculator(standardWithMods);
const difficultyAttributes2 = difficultyCalculator2.calculate(); // with mods!
const moddedAttributes2 = difficultyCalculator2.calculateWithMods(mods); // the same as previous line.
```

## Example of performance calculation

```js
import { ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!standard ruleset.
const ruleset = new StandardRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('HDDT');
const standardBeatmap = ruleset.applyToBeatmapWithMods(parsed, mods);

// Create difficulty calculator for osu!std beatmap.
const difficultyCalculator = ruleset.createDifficultyCalculator(standardBeatmap);

// Calculate difficulty attributes.
const difficultyAttributes = difficultyCalculator.calculate();

// Stella-rium (Asterisk MAKINA Remix) [Starlight]
// sakamata1 + HDDT 1192.44 pp.
const score = new ScoreInfo({
  maxCombo: 2078,
  rulesetId: 0,
  count300: 1576, // score.statistics.great
  count100: 24, // score.statistics.good
  count50: 0, // score.statistics.meh
  countMiss: 0, // score.statistics.miss
  mods,
});

score.accuracy = (score.count300 + (score.count100 / 3) + (score.count50 / 6)) 
  / (score.count300 + score.count100 + score.count50 + score.countMiss);

// Create performance calculator for osu!std ruleset.
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
console.log(totalPerformance); // 1185.4179868162294
```

## Other projects

All projects below are based on this code.

- [osu-parsers](https://github.com/kionell/osu-parsers.git) - A bundle of parsers for different osu! file formats.
- [osu-taiko-stable](https://github.com/kionell/osu-taiko-stable.git) - The osu!taiko ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-standard-stable/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.