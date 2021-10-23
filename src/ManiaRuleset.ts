import {
  ManiaBeatmapProcessor,
  ManiaBeatmapConverter,
} from './Beatmaps';

import { ManiaModCombination } from './Mods/ManiaModCombination';
import { Ruleset } from 'osu-resources';

/**
 * osu!mania ruleset.
 */
export class ManiaRuleset extends Ruleset {
  /**
   * osu!mania ruleset ID.
   */
  get id(): number {
    return 3;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param bitwise Mod bitwise.
   * @returns A new mod combination.
   */
  createModCombination(bitwise: number): ManiaModCombination {
    return new ManiaModCombination(bitwise);
  }

  /**
   * @returns A new osu!mania beatmap processor.
   */
  createBeatmapProcessor(): ManiaBeatmapProcessor {
    return new ManiaBeatmapProcessor();
  }

  /**
   * @returns A new osu!mania beatmap converter.
   */
  createBeatmapConverter(): ManiaBeatmapConverter {
    return new ManiaBeatmapConverter();
  }
}
