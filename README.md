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

## How to use it

```js
import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
import { StandardRuleset } from 'osu-standard-stable';

const decodePath = 'path/to/your/decoding/file.osu';
const encodePath = 'path/to/your/encoding/file.osu';
const shouldParseSb = true;

// Get beatmap object.
const parsed = BeatmapDecoder.decodeFromPath(decodePath, shouldParseSb);

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

// It will write osu!stdandard beatmap with no mods.
BeatmapEncoder.encodeToPath(encodePath, standardWithNoMod1);

// It will write osu!stdandard beatmap with applied mods.
BeatmapEncoder.encodeToPath(encodePath, standardWithMods);
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