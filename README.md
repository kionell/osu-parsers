# osu-parsers
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-parsers)](https://www.codefactor.io/repository/github/kionell/osu-parsers)
[![License](https://img.shields.io/github/license/kionell/osu-parsers)](https://github.com/kionell/osu-parsers/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-parsers)](https://www.npmjs.com/package/osu-parsers)


A bundle of parsers for osu! File formats based on the osu!lazer source code.

- Written in TypeScript.
- Based on the osu!lazer source code.
- Can be used for parsing beatmaps from any osu! game modes.
- Supports beatmap conversion between different game modes.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-parsers
```

### Requirements

Since this project uses ES Modules, it is recommended to use Node.js 12.22.0 or newer.

## Decoding

There are 3 ways to read data through decoders:
- via file path
- via string
- via array of split lines

By default, beatmap decoding will decode storyboard as well. You can turn off this behavior by passing false as the second argument to any of the methods. If decoder fails to read your data then it will return default parsed beatmap object.

### Example of beatmap decoding

```js
import { BeatmapDecoder } from 'osu-parsers'

const path = 'path/to/your/file.osu';
const shouldParseSb = true;

const beatmap = BeatmapDecoder.decodeFromPath(path, shouldParseSb);

console.log(beatmap) // ParsedBeatmap object.
```

### Example of storyboard decoding

```js
import { StoryboardDecoder } from 'osu-parsers'

const path = 'path/to/your/file.osb';

const storyboard = StoryboardDecoder.decodeFromPath(path);

console.log(storyboard); // Storyboard object.
```

## Encoding

Encoding can be done in 2 ways:
- Encoding to file
- Encoding to string

When the encoding is complete, the finished files can be used inside the game as usual.

### Example of beatmap encoding

```js
import { BeatmapDecoder, BeatmapEncoder } from 'osu-parsers'

const decodePath = 'path/to/your/decoding/file.osu';
const shouldParseSb = true;

const beatmap = BeatmapDecoder.decodeFromPath(decodePath, shouldParseSb);

// Do your stuff with beatmap...

const encodePath = 'path/to/your/encoding/file.osu';

BeatmapEncoder.encodeToPath(encodePath, beatmap); 
```

### Example of storyboard encoding

```js
import { StoryboardDecoder, StoryboardEncoder } from 'osu-parsers'

const decodePath = 'path/to/your/decoding/file.osb';

const storyboard = StoryboardDecoder.decodeFromPath(decodePath);

// Do your stuff with storyboard...

const encodePath = 'path/to/your/encoding/file.osb';

StoryboardEncoder.encodeToPath(encodePath, storyboard); 
```

## Rulesets (WIP)

You always should apply one of the rulesets to your parsed beatmaps. There are 4 basic rulesets in total that support parsed beatmaps from this decoder. If necessary, you can always write your own ruleset using the classes from the [osu-resources](https://github.com/kionell/osu-resources.git) project. By applying a ruleset to a parsed beatmap, you get the ability to apply mods, calculate max combo and convert maps to other game modes.

- [osu-standard-stable](https://github.com/kionell/osu-standard-stable.git) - The osu!std ruleset based on the osu!lazer source code.
- [osu-taiko-stable](https://github.com/kionell/osu-taiko-stable.git) - The osu!taiko ruleset based on the osu!lazer source code.
- [osu-catch-stable](https://github.com/kionell/osu-catch-stable.git) - The osu!catch ruleset based on the osu!lazer source code.
- [osu-mania-stable](https://github.com/kionell/osu-mania-stable.git) - The osu!mania ruleset based on the osu!lazer source code.

## Documentation

Auto-generated documentation is available [here](https://kionell.github.io/osu-parsers/).

## Contributing

This project is being developed personally by me on pure enthusiasm. If you want to help with development or fix a problem, then feel free to create a new pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) for details.
