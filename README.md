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

### Requirements

Since this project uses ES Modules, it is recommended to use Node.js 12.22.0 or newer.

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

// This will create a new copy of a beatmap with applied osu!standard ruleset.
// This method implicitly applies mod combination of 0.
const standardWithNoMod1 = ruleset.applyToBeatmap(parsed);

// Another way to create osu!standard beatmap with no mods. 
const standardWithNoMod2 = ruleset.applyToBeatmapWithMods(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const standardWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!standard beatmap with no mods.
encoder.encodeToPath(encodePath, standardWithNoMod1);

// It will write osu!standard beatmap with applied mods.
encoder.encodeToPath(encodePath, standardWithMods);
```

## Example of difficulty calculation

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

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);

// Create difficulty calculator for osu!std beatmap.
const difficultyCalculator2 = ruleset.createDifficultyCalculator(standardWithMods);

// Difficulty calculator will implicitly apply osu!std ruleset to every beatmap.
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

// Create new Score.
const score = new ScoreInfo();

// Stella-rium (Asterisk MAKINA Remix) [Starlight]
// mrekk + HDDT 1192 pp.
score.beatmap = standardBeatmap;
score.mods = mods;
score.maxCombo = 2078;
score.statistics.great = 1576;
score.statistics.ok = 24;
score.statistics.meh = 0;
score.statistics.miss = 0;

score.accuracy = (score.statistics.great + (score.statistics.ok / 3) + (score.statistics.meh / 6)) 
  / (score.statistics.great + score.statistics.ok + score.statistics.meh + score.statistics.miss);

// Create performance calculator for osu!std ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();

// 1192.4434422818401
console.log(totalPerformance);
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