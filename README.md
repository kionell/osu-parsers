# osu-taiko-stable
[![CodeFactor](https://img.shields.io/codefactor/grade/github/kionell/osu-taiko-stable)](https://www.codefactor.io/repository/github/kionell/osu-taiko-stable)
[![License](https://img.shields.io/github/license/kionell/osu-taiko-stable)](https://github.com/kionell/osu-taiko-stable/blob/master/LICENSE)
[![Package](https://img.shields.io/npm/v/osu-taiko-stable)](https://www.npmjs.com/package/osu-taiko-stable)


osu!stable version of osu!taiko ruleset based on osu!lazer source code.

- Supports TypeScript.
- Based on the osu!lazer source code.
- Supports beatmap conversion from other game modes.
- Can apply & reset osu!taiko mods.

## Installation

Add a new dependency to your project via npm:

```bash
npm install osu-taiko-stable
```

### Requirements

Since this project uses ES Modules, it is recommended to use Node.js 12.22.0 or newer.

## How to use it

```js
import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
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

// This will create a new copy of a beatmap with applied osu!taiko ruleset.
// This method implicitly applies mod combination of 0.
const taikoWithNoMod1 = ruleset.applyToBeatmap(parsed);

// Another way to create osu!taiko beatmap with no mods. 
const taikoWithNoMod2 = ruleset.applyToBeatmapWithMods(parsed);

// Create mod combination and apply it to beatmap.
const mods = ruleset.createModCombination(1337);
const taikoWithMods = ruleset.applyToBeatmapWithMods(parsed, mods);

// It will write osu!taiko beatmap with no mods.
encoder.encodeToPath(encodePath, taikoWithNoMod1);

// It will write osu!taiko beatmap with applied mods.
encoder.encodeToPath(encodePath, taikoWithMods);
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