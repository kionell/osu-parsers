import {
  TaikoBeatmapProcessor,
  TaikoBeatmapConverter,
} from './Beatmaps';

import { TaikoModCombination } from './Mods/TaikoModCombination';
import { Ruleset } from 'osu-resources';

/**
 * osu!taiko ruleset.
 */
export class TaikoRuleset extends Ruleset {
  /**
   * osu!taiko ruleset ID.
   */
  get id(): number {
    return 1;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param bitwise Mod bitwise.
   * @returns A new mod combination.
   */
  createModCombination(bitwise: number): TaikoModCombination {
    return new TaikoModCombination(bitwise);
  }

  /**
   * @returns A new osu!taiko beatmap processor.
   */
  createBeatmapProcessor(): TaikoBeatmapProcessor {
    return new TaikoBeatmapProcessor();
  }

  /**
   * @returns A new osu!taiko beatmap converter.
   */
  createBeatmapConverter(): TaikoBeatmapConverter {
    return new TaikoBeatmapConverter();
  }
}
