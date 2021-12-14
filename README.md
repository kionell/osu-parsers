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

### Requirements

Since this project uses ES Modules, it is recommended to use Node.js 12.22.0 or newer.

## Example of converting beatmap to the osu!mania ruleset

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers';
import { maniaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath, shouldParseSb);

// Create a new osu!mania ruleset.
const ruleset = new maniaRuleset();

// This will create a new copy of a beatmap with applied osu!mania ruleset.
// This method implicitly applies mod combination of 0.
const maniaWithNoMod1 = ruleset.applyToBeatmap(parsed);

// Another way to create osu!mania beatmap with no mods. 
const maniaWithNoMod2 = ruleset.applyToBeatmapWithMods(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const maniaWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!mania beatmap with no mods.
encoder.encodeToPath(encodePath, maniaWithNoMod1);

// It will write osu!mania beatmap with applied mods.
encoder.encodeToPath(encodePath, maniaWithMods);
```

## Example of difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { maniaRuleset } from 'osu-mania-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!mania ruleset.
const ruleset = new maniaRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337); // HD, HR, FL, SD, HT
const maniaWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);

// Create difficulty calculator for osu!mania beatmap.
const difficultyCalculator2 = ruleset.createDifficultyCalculator(maniaWithMods);

// This will force NoMod even if beatmap has its own mods.
// Difficulty calculator will implicitly apply osu!mania ruleset to every beatmap.
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
const mods = ruleset.createModCombination('NM');
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);

// Create new Score.
const score = new ScoreInfo();

// xi - Last Resort [[7K] Jakads' LASTING LEGACY]
// Jakads + NM 1351 pp.
score.beatmap = maniaBeatmap;
score.mods = mods;
score.totalScore = 989698;
score.statistics.perfect = 2747;
score.statistics.great = 608;
score.statistics.good = 13;
score.statistics.ok = 0;
score.statistics.meh = 0;
score.statistics.miss = 1;

// Create performance calculator for osu!mania ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();

// 1350.7482145000727
console.log(totalPerformance);
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