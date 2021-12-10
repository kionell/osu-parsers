import { Ruleset, ScoreInfo } from 'osu-resources';

import {
  StandardBeatmapProcessor,
  StandardBeatmapConverter,
  StandardBeatmap,
} from './Beatmaps';

import {
  StandardDifficultyAttributes,
  StandardDifficultyCalculator,
  StandardPerformanceCalculator,
} from './Difficulty';

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
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input: number | string): StandardModCombination {
    return new StandardModCombination(input);
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

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!std difficulty calculator.
   */
  createDifficultyCalculator(beatmap: StandardBeatmap): StandardDifficultyCalculator {
    return new StandardDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!std performance calculator.
   */
  createPerformanceCalculator(attributes: StandardDifficultyAttributes, score: ScoreInfo): StandardPerformanceCalculator {
    return new StandardPerformanceCalculator(this, attributes, score);
  }
}
