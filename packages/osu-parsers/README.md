# osu-parsers
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-parsers)](https://www.codefactor.io/repository/github/kionell/osu-parsers)
[![License](https://img.shields.io/github/license/kionell/osu-parsers)](https://github.com/kionell/osu-parsers/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-parsers)](https://www.npmjs.com/package/osu-parsers)


A bundle of decoders/encoders for osu! file formats based on the osu!lazer source code.

- Written in TypeScript.
- Based on the osu!lazer source code.
- Allows you to parse beatmaps of any osu! game mode.
- Supports beatmap conversion between different game modes.
- Works in browsers.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-parsers
```

## Dependencies

This package comes with built-in LZMA codec as it is required for replay processing.
All classes and their typings can be found in [osu-classes](https://github.com/kionell/osu-classes) package which is a peer dependency and must be installed separately.

## Supported file formats

- [.osu](https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29) - fully supported (decoding/encoding)
- [.osb](https://osu.ppy.sh/wiki/en/Client/File_formats/osb_%28file_format%29) - fully supported (decoding/encoding)
- [.osr](https://osu.ppy.sh/wiki/en/Client/File_formats/osr_%28file_format%29) - fully supported (decoding/encoding)

## Beatmap decoding

Beatmap decoder is used to read `.osu` files and convert them to the objects of plain [Beatmap](https://kionell.github.io/osu-classes/classes/Beatmap.html) type.
Note that plain beatmap objects can't be used to get max combo, star rating and performance as they don't have ruleset specific data. To get correct beatmap data, beatmap objects should be converted using one of the supported [rulesets](https://github.com/kionell/osu-parsers#rulesets).

There are 4 ways to read data using this decoders:
- via file path - async
- via data buffer - sync
- via string - sync
- via array of split lines - sync

By default, beatmap decoder will decode both beatmap and storyboard. If you want to decode beatmap without storyboard, you can pass `false` as the second parameter to any of the methods.
There is also a support for partial beatmap decoding which allows you to skip unnecessary sections.

### Example of beatmap decoding

```js
import { BeatmapDecoder } from 'osu-parsers'

const path = 'path/to/your/file.osu';
const data = 'osu file format v14...';

// This is optional and true by default.
const shouldParseSb = true;

const decoder = new BeatmapDecoder();
const beatmap1 = await decoder.decodeFromPath(path, shouldParseSb);

// Partial beatmap decoding without unnecessary sections.
const beatmap2 = decoder.decodeFromString(data, {
  parseGeneral: false,
  parseEditor: false,
  parseMetadata: false,
  parseDifficulty: false,
  parseEvents: false,
  parseTimingPoints: false,
  parseHitObjects: false,
  parseStoryboard: false,
  parseColours: false,
});

console.log(beatmap1) // Beatmap object.
console.log(beatmap2) // Another Beatmap object.
```

## Storyboard decoding

Storyboard decoder is used to read both `.osu` and `.osb` files and convert them to the [Storyboard](https://kionell.github.io/osu-classes/classes/Storyboard.html) objects.

As in beatmap decoder, there are 4 ways to decode your `.osu` and `.osb` files:
- via file path - async
- via data buffer - sync
- via string - sync
- via array of split lines - sync

### Example of storyboard decoding

```js
import { StoryboardDecoder } from 'osu-parsers'

const pathToOsb = 'path/to/your/file.osb';
const pathToOsu = 'path/to/your/file.osu';

const decoder = new StoryboardDecoder();

// Parse a single storyboard file (from .osb) for beatmaps that doesn't have internal storyboard (from .osu)
const storyboard1 = await decoder.decodeFromPath(pathToOsb);

// Combines main storyboard (from .osu) with secondary storyboard (from .osb)
const storyboard2 = await decoder.decodeFromPath(pathToOsu, pathToOsb);

console.log(storyboard1); // Storyboard object.
console.log(storyboard2); // Another Storyboard object.
```

## Score & replay decoding

Score decoder is used to decode `.osr` files and convert them to the [Score](https://kionell.github.io/osu-classes/classes/Score.html) objects.
Score object contains score information and replay data of plain [Replay](https://kionell.github.io/osu-classes/classes/Replay.html) type.
Note that all `.osr` files contain raw legacy frame data that was initially intended for osu!standard only. To get correct data, replay objects should be converted using one of the supported [rulesets](https://github.com/kionell/osu-parsers#rulesets).
This decoder is based on external LZMA library and works asynchronously.

There are 2 ways to read data through this decoder:
- via file path - async
- via buffer - async

By default, score decoder will decode both score information and replay. If you want to decode score information without replay, you can pass `false` as the second parameter to any of the methods.

### Example of score & replay decoding

```js
import { ScoreDecoder } from 'osu-parsers'

const path = 'path/to/your/file.osr';

// This is optional and true by default.
const parseReplay = true;

const decoder = new ScoreDecoder();

const score = await decoder.decodeFromPath(path, parseReplay)

console.log(score.info); // ScoreInfo object.
console.log(score.replay); // Replay object or null.
```

## Encoding

All objects parsed by these decoders can easily be stringified and written to the files.
Note that encoders will write object data without any changes. For example, if you try to encode beatmap with applied mods, it will write modded values!

When encoding is complete you can import resulting files to the game.

### Example of beatmap encoding

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers'

const decodePath = 'path/to/your/file.osu';
const shouldParseSb = true;

const decoder = new BeatmapDecoder();
const encoder = new BeatmapEncoder();

const beatmap = await decoder.decodeFromPath(decodePath, shouldParseSb);

// Do your stuff with beatmap...

const encodePath = 'path/to/your/file.osu';

// Write IBeatmap object to an .osu file.
await encoder.encodeToPath(encodePath, beatmap);

// You can also encode IBeatmap object to a string.
const stringified = encoder.encodeToString(beatmap);
```

### Example of storyboard encoding

```js
import { StoryboardDecoder, StoryboardEncoder } from 'osu-parsers'

const decodePath = 'path/to/your/file.osb';

const decoder = new StoryboardDecoder();
const encoder = new StoryboardEncoder();

const storyboard = await decoder.decodeFromPath(decodePath);

// Do your stuff with storyboard...

const encodePath = 'path/to/your/file.osb';

// Write Storyboard object to an .osb file.
await encoder.encodeToPath(encodePath, storyboard);

// You can also encode Storyboard object to a string.
const stringified = encoder.encodeToString(storyboard);
```

### Example of score & replay encoding

```js
import { ScoreDecoder, ScoreEncoder } from 'osu-parsers'

const decodePath = 'path/to/your/file.osr';

const decoder = new ScoreDecoder();
const encoder = new ScoreEncoder();

const score = await decoder.decodeFromPath(decodePath);

// Do your stuff with score info and replay...

const encodePath = 'path/to/your/file.osr';

// Write IScore object to an .osr file.
await encoder.encodeToPath(encodePath, score);

// You can also encode IScore object to a buffer.
const buffer = await encoder.encodeToBuffer(score);
```

## Rulesets

This library by itself doesn't provide any tools for difficulty and performance calculation!!!!
If you are looking for something related to this, then rulesets may come in handy for you.
Rulesets are separate libraries based on the classes from the [osu-classes](https://github.com/kionell/osu-classes.git) project. They allow you to work with gamemode specific stuff as difficulty, performance, mods and max combo calculation. Because of the shared logic between all of the rulesets they are compatible between each other. If you want, you can even write your own custom ruleset!
The great thing about all this stuff is a beatmap and replay conversion. Any beatmap or replay can be used with any ruleset library as long as they implement the same interfaces.

There are 4 basic rulesets that support parsed beatmaps from this decoder:

- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!std ruleset based on the osu!lazer source code.
- [osu-taiko-stable](https://github.com/kionell/osu-taiko-stable.git) - The osu!taiko ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

You can also try existing [osu-pp-calculator](https://github.com/kionell/osu-pp-calculator) package. It's a wrapper for all 4 rulesets above with a lot of extra useful stuff like score simulation and beatmap downloading.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-parsers/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.
