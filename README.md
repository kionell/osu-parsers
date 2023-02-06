# osu-catch-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-catch-stable)](https://www.codefactor.io/repository/github/kionell/osu-catch-stable)
[![License](https://img.shields.io/github/license/kionell/osu-catch-stable)](https://github.com/kionell/osu-catch-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-catch-stable)](https://www.npmjs.com/package/osu-catch-stable)


JavaScript port of the current live version of the osu!catch ruleset.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!catch mods.
- Very accurate difficulty & performance calculation (up to 15-16 digits after decimal point)

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-catch-stable
```

## Existing performance calculator library

This ruleset is a part of [osu-pp-calculator](https://github.com/kionell/osu-pp-calculator) package. It's highly recommended to use existing package for performance calculation if you don't want to write a lot of boilerplate code for score simulation and beatmap downloading. 

## Requirements

Before you can start using this ruleset library, you need to install [osu-classes](https://github.com/kionell/osu-classes) package as this ruleset based on it. Also you need to install [osu-parsers](https://github.com/kionell/osu-parsers) or any other compatible beatmap parser that works with [IBeatmap](https://kionell.github.io/osu-classes/interfaces/IBeatmap.html) interface.

## Beatmap conversion

Any beatmap that implements IBeatmap interface can be converted to this ruleset. Unlike the game itself, you can convert beatmaps between different game modes, not just from osu!standard. This is possible due to the fact that hit objects from [osu-classes](https://github.com/kionell/osu-classes) keep their initial position taken from the .osu file. All beatmaps with applied ruleset keep the reference to the original beatmap, which allows you to repeat the process of conversion or apply different ruleset.

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
encoder.encodeToPath(encodePath, catchWithNoMod);

// It will write osu!catch beatmap with applied mods to a file.
encoder.encodeToPath(encodePath, catchWithMods);

// You can also write osu!catch beatmap object to a string.
const stringified = encoder.encodeToString(catchWithMods);
```

## Difficulty calculation

```js
import { BeatmapDecoder } from 'osu-parsers';
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

// Create mod combination.
const mods = ruleset.createModCombination('HR');

// Create difficulty calculator for IBeatmap object.
const difficultyCalculator = ruleset.createDifficultyCalculator(parsed);

// You can pass any IBeatmap object to the difficulty calculator.
// Difficulty calculator will implicitly create a new beatmap with osu!catch ruleset.
const difficultyAttributes = difficultyCalculator.calculateWithMods(mods);
```

### Example of stringified difficulty attributes

```json
{
  "maxCombo": 3333,
  "mods": "HR",
  "starRating": 10.337597581797825,
  "approachRate": 10
}
```

## Advanced difficulty calculation

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
const mods = ruleset.createModCombination('HDHR');
const catchWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

/**
 * Any IBeatmap object can be used to create difficulty calculator. 
 * Difficulty calculator implicitly applies osu!catch ruleset with no mods.
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
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

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
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

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
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

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
import { CatchRuleset } from 'osu-catch-stable';

const decoder = new BeatmapDecoder();

const decodePath = 'path/to/your/decoding/file.osu';

// Get beatmap object.
const parsed = decoder.decodeFromPath(decodePath);

// Create a new osu!catch ruleset.
const ruleset = new CatchRuleset();

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination('HR');
const catchBeatmap = ruleset.applyToBeatmapWithMods(parsed, mods);

// Create difficulty calculator for osu!catch beatmap.
const difficultyCalculator = ruleset.createDifficultyCalculator(catchBeatmap);

// Calculate difficulty attributes.
const difficultyAttributes = difficultyCalculator.calculate();

// Deadly force - Put an end (Noah) [Revolt from the Abyss]
// YesMyDarknesss + HR 1601.39 pp.
const score = new ScoreInfo({
  rulesetId: 2,
  maxCombo: 3333,
  count300: 3293, // score.statistics.great (fruits)
  count100: 40, // score.statistics.largeTickHit (droplets)
  count50: 191, // score.statistics.smallTickHit (tiny droplets)
  countKatu: 0, // score.statistics.smallTickMiss (missed tiny droplets)
  countMiss: 0, // score.statistics.misses
  mods,
});

// Create performance calculator for osu!catch ruleset.
const performanceCalculator = ruleset.createPerformanceCalculator(difficultyAttributes, score);

// Calculate performance attributes for a map.
const performanceAttributes = performanceCalculator.calculateAttributes();

// Calculate total performance for a map.
const totalPerformance = performanceCalculator.calculate();
```

### Example of stringified performance attributes

```json
{
  "mods": "HR",
  "totalPerformance": 1601.3928968609464
}
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
