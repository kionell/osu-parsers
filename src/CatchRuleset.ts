import { Ruleset, ScoreInfo } from 'osu-resources';

import {
  CatchBeatmapProcessor,
  CatchBeatmapConverter,
  CatchBeatmap,
} from './Beatmaps';

import {
  CatchDifficultyAttributes,
  CatchDifficultyCalculator,
  CatchPerformanceCalculator,
} from './Difficulty';

import { CatchModCombination } from './Mods';

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

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!catch difficulty calculator.
   */
  createDifficultyCalculator(beatmap: CatchBeatmap): CatchDifficultyCalculator {
    return new CatchDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!catch performance calculator.
   */
  createPerformanceCalculator(attributes: CatchDifficultyAttributes, score: ScoreInfo): CatchPerformanceCalculator {
    return new CatchPerformanceCalculator(this, attributes, score);
  }
}
