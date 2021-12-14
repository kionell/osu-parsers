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
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input: number | string): ManiaModCombination {
    return new ManiaModCombination(input);
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
