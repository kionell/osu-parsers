import { Ruleset, ScoreInfo } from 'osu-resources';

import {
  TaikoBeatmapProcessor,
  TaikoBeatmapConverter,
  TaikoBeatmap,
} from './Beatmaps';

import {
  TaikoDifficultyAttributes,
  TaikoDifficultyCalculator,
  TaikoPerformanceCalculator,
} from './Difficulty';

import { TaikoModCombination } from './Mods/TaikoModCombination';

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

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!taiko difficulty calculator.
   */
  createDifficultyCalculator(beatmap: TaikoBeatmap): TaikoDifficultyCalculator {
    return new TaikoDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!taiko performance calculator.
   */
  createPerformanceCalculator(attributes: TaikoDifficultyAttributes, score: ScoreInfo): TaikoPerformanceCalculator {
    return new TaikoPerformanceCalculator(this, attributes, score);
  }
}
