import { Ruleset, ScoreInfo } from 'osu-resources';

import {
  StandardBeatmapProcessor,
  StandardBeatmapConverter,
  StandardBeatmap,
} from './Beatmaps';


import { StandardModCombination } from './Mods/StandardModCombination';

/**
 * osu!std ruleset.
 */
export class StandardRuleset extends Ruleset {
  /**
   * osu!std ruleset ID.
   */
  get id(): number {
    return 0;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param bitwise Mod bitwise.
   * @returns A new mod combination.
   */
  createModCombination(bitwise: number): StandardModCombination {
    return new StandardModCombination(bitwise);
  }

  /**
   * @returns A new osu!std beatmap processor.
   */
  createBeatmapProcessor(): StandardBeatmapProcessor {
    return new StandardBeatmapProcessor();
  }

  /**
   * @returns A new osu!std beatmap converter.
   */
  createBeatmapConverter(): StandardBeatmapConverter {
    return new StandardBeatmapConverter();
  }
}
