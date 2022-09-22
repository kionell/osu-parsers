# osu-taiko-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-taiko-stable)](https://www.codefactor.io/repository/github/kionell/osu-taiko-stable)
[![License](https://img.shields.io/github/license/kionell/osu-taiko-stable)](https://github.com/kionell/osu-taiko-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-taiko-stable)](https://www.npmjs.com/package/osu-taiko-stable)


JavaScript port of the current live version of the osu!taiko ruleset.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!taiko mods.
- Very accurate difficulty & performance calculation (up to 6 digits after decimal point)

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-taiko-stable
```

## Requirements

Before you can start using this ruleset library, you need to install [osu-classes](https://github.com/kionell/osu-classes)) package as this ruleset based on it. Also you need to install [osu-parsers](https://github.com/kionell/osu-parsers)) or any other compatible beatmap parser that works with [IBeatmap](https://kionell.github.io/osu-classes/interfaces/IBeatmap.html) interface.

## Beatmap conversion

Any beatmap that implements IBeatmap interface can be converted to this ruleset. Unlike the game itself, you can convert beatmaps between different game modes, not just from osu!standard. This is possible due to the fact that hit objects from [osu-classes](https://github.com/kionell/osu-classes)) keep their initial position taken from the .osu file. All beatmaps with applied ruleset keep the reference to the original beatmap, which allows you to repeat the process of conversion or apply different ruleset.

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath, shouldParseSb);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// This will create a new shallow copy of a beatmap with applied osu!taiko ruleset.
// This method implicitly applies mod combination of 0.
const taikoWithNoMod = ruleset.applyToBeatmap(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const taikoWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!taiko beatmap with no mods to a file.
encoder.encodeToPath(encodePath, taikoWithNoMod);

// It will write osu!taiko beatmap with applied mods to a file.
encoder.encodeToPath(encodePath, taikoWithMods);

// You can also write osu!taiko beatmap object to a string.
const stringified = encoder.encodeToString(taikoWithMods);
```

## Difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create mod combination.
const mods = ruleset.createModCombination('HDHRNCFL');

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

// You can pass any IBeatmap object to the difficulty calculator.
// Difficulty calculator will implicitly create a new beatmap with osu!taiko ruleset.
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);
```

### Example of stringified difficulty attributes

```json
{
  "maxCombo": 1237,
  "mods": "HDHRNCFL",
  "starRating": 7.880605544897504,
  "staminaStrain": 3.318267825678439,
  "rhythmStrain": 2.733676323652416,
  "colourStrain": 0.5701148584485592,
  "approachRate": 0,
  "greatHitWindow": 13.333333333333334
}
```

## Advanced difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('HDHR');
const taikoWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

/**
 * Any IBeatmap object can be used to create difficulty calculator. 
 * Difficulty calculator implicitly applies osu!taiko ruleset with no mods.
 */
const difficultyCalculator1 = ruleset.createDifficultyCalculator(parsed);
const difficultyAttributes1 = difficultyCalculator1.calculate(); // no mods.
const moddedAttributes1 = difficultyCalculator1.calculateWithMods(mods); // with mods.

/**
 * If you pass osu!taiko beatmap then it will use its ruleset and mods.
 */
const difficultyCalculator2 = ruleset.createDifficultyCalculator(taikoWithMods);
const difficultyAttributes2 = difficultyCalculator2.calculate(); // with mods!
const moddedAttributes2 = difficultyCalculator2.calculateWithMods(mods); // the same as previous line.

/**
 * You can also pass custom clock rate as the last parameter.
 * It will be used instead of the original beatmap's clock rate.
 */
const customClockRate = 2;
const difficultyAttributes3 = difficultyCalculator2.calculate(customClockRate);
const moddedAttributes3 = difficultyCalculator2.calculateWithMods(mods, customClockRate);
```

## Gradual difficulty calculation

Sometimes you may need to calculate difficulty of a beatmap gradually and return attributes on every step of calculation. This is useful for real time difficulty calculation when you update your values depending on the current hit object. This can be really slow and RAM heavy for long beatmaps because attributes are created every 400 ms of the beatmap (default strain step).

```js
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('NCHR');

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

/**
 * Calculate timed difficulty attributes of the beatmap.
 */
const difficultyAttributes1 = difficultyCalculator.calculateTimed();
const difficultyAttributes2 = difficultyCalculator.calculateTimedWithMods(mods);

/**
 * Calculate time difficulty attributes with custom clock rate.
 */
const clockRate = 3;
const difficultyAttributes3 = difficultyCalculator.calculateTimed(mods, clockRate);
const difficultyAttributes4 = difficultyCalculator.calculateTimedWithMods(mods, clockRate);
```

## Partial difficulty calculation 

This is a special case of gradual difficulty calculation. This is useful when you need to get difficulty attributes at a specific point of the beatmap. Unlike the previous method, this one returns difficulty attributes only once without huge memory allocations.

```js
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('EZHD');

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

/**
 * Get object count for partial difficulty calculation.
 * This can be any number, but for example we will calculate first half of the beatmap.
 */
const totalObjects = Math.ceil(parsed.hitObjects.length / 2);

/**
 * Calculate difficulty at the middle of the beatmap.
 */
const partialAttributes1 = difficultyCalculator.calculateAt(totalObjects);
const partialAttributes2 = difficultyCalculator.calculateWithModsAt(mods, totalObjects);

/**
 * Calculate partial difficulty with custom clock rate.
 */
const clockRate = 1.2;
const partialAttributes3 = difficultyCalculator.calculateAt(totalObjects, clockRate);
const partialAttributes4 = difficultyCalculator.calculateWithModsAt(mods, totalObjects, clockRate);
```

## Calculating all possible modded attributes at once

Difficulty calculator can be used to calculate all attributes for every difficulty affecting modded combination. This can be time consuming for long beatmaps. All attributes are calculated inside generator function and returned as an iterator. Use JS spread syntax if you want to convert attributes to array.

```js
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

/**
 * Calculate difficulty at the middle of the beatmap.
 */
for (const attributes of difficultyCalculator.calculateAll()) {
  // Do your stuff with calculated attributes...
}
```

## Performance calculation

```js
import { ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { TaikoRuleset } from 'osu-taiko-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!taiko ruleset.
const ruleset = new TaikoRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('EZHTFL');
const taikoBeatmap = ruleset.applyToBeatmapWithMods(parsed, mods);

// Create difficulty calculator for osu!taiko beatmap.
const difficultyCalculator = ruleset.createDifficultyCalculator(taikoBeatmap);

// Calculate difficulty attributes.
const difficultyAttributes = difficultyCalculator.calculate();

// Period. ~ Seishin no Kousoku to Jiyuu o Tsukamu Jouka (tsunamix_underground) [Inner Oni]
// Eriha + HDHRNCFL 728.77 pp.
const score = new ScoreInfo({
  maxCombo: 1237,
  rulesetId: 1,
  count300: 1235, // score.statistics.great
  count100: 2, // score.statistics.good
  countMiss: 0, // score.statistics.miss
  mods,
});

score.accuracy = (score.count300 + score.count100 / 2)
  / (score.count300 + score.count100 + score.countMiss);

// Create performance calculator for osu!taiko ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate performance attributes for a map.
const performanceAttributes = performanceCalculator.calculateAttributes();

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();
```

### Example of stringified performance attributes

```json
{
  "mods": "HDHRNCFL",
  "totalPerformance": 728.7696451295643,
  "strainPerformance": 347.26906467835136,
  "accuracyPerformance": 293.97172076602436
}
```

## Other projects

All projects below are based on this code.

- [osu-parsers](https://github.com/kionell/osu-parsers.git) - A bundle of parsers for different osu! file formats.
- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!standard ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-taiko-stable/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.