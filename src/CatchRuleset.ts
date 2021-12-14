import { CatchBeatmapProcessor } from './Beatmaps/CatchBeatmapProcessor';
import { CatchBeatmapConverter } from './Beatmaps/CatchBeatmapConverter';
import { CatchModCombination } from './Mods/CatchModCombination';

import { Ruleset } from 'osu-resources';

/**
 * osu!catch ruleset.
 */
export class CatchRuleset extends Ruleset {
  /**
   * osu!catch ruleset ID.
   */
  get id(): number {
    return 2;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input: number | string): CatchModCombination {
    return new CatchModCombination(input);
  }

  /**
   * @returns A new osu!catch beatmap processor.
   */
  createBeatmapProcessor(): CatchBeatmapProcessor {
    return new CatchBeatmapProcessor();
  }

  /**
   * @returns A new osu!catch beatmap converter.
   */
  createBeatmapConverter(): CatchBeatmapConverter {
    return new CatchBeatmapConverter();
  }
}
