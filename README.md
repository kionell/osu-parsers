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

### Requirements

Since this project uses ES Modules, it is recommended to use Node.js 12.22.0 or newer.

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

// This will create a new copy of a beatmap with applied osu!catch ruleset.
// This method implicitly applies mod combination of 0.
const catchWithNoMod1 = ruleset.applyToBeatmap(parsed);

// Another way to create osu!catch beatmap with no mods. 
const catchWithNoMod2 = ruleset.applyToBeatmapWithMods(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const catchWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!catch beatmap with no mods.
encoder.encodeToPath(encodePath, catchWithNoMod1);

// It will write osu!catch beatmap with applied mods.
encoder.encodeToPath(encodePath, catchWithMods);
```

## Example of difficulty calculation

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

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);

// Create difficulty calculator for osu!catch beatmap.
const difficultyCalculator2 = ruleset.createDifficultyCalculator(catchWithMods);

// This will force NoMod even if beatmap has its own mods.
// Difficulty calculator will implicitly apply osu!catch ruleset to every beatmap.
const difficultyAttributesWithNoMod1 = difficultyCalculator1.calculate();
const difficultyAttributesWithNoMod2 = difficultyCalculator2.calculate();

// Calculate difficulty with mods.
const difficultyAttributesWithMods1 = difficultyCalculator1.calculateWithMods(mods);
const difficultyAttributesWithMods2 = difficultyCalculator2.calculateWithMods(mods);

// Get difficulty attributes for every mod combination.
const difficultyAtts1 = [...difficultyCalculator1.calculateAll()];
const difficultyAtts2 = [...difficultyCalculator2.calculateAll()];
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

// Create new Score.
const score = new ScoreInfo();

// Kaneko Chiharu - iLLness LiLin [CRYSTAL'S DYSTOPIA]
// CTB Rushia1 + HDHR 1380 pp.
score.beatmap = catchBeatmap;
score.mods = mods;
score.maxCombo = 1420;
score.statistics.great = 1358;
score.statistics.largeTickHit = 62;
score.statistics.smallTickHit = 83;
score.statistics.smallTickMiss = 2;
score.statistics.miss = 0;

// Create performance calculator for osu!catch ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();

// 1380.0841687636698
console.log(totalPerformance);
```

## Other projects

All projects below are based on this code.

- [osu-parsers](https://github.com/kionell/osu-parsers.git) - A bundle of parsers for different osu! file formats.
- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!standard ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-catch-stable/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.