import {
  Ruleset,
  IBeatmap,
  IScoreInfo,
} from 'osu-classes';

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
import { TaikoReplayConverter } from './Replays';

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
   * Applies osu!taiko ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new osu!taiko beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): TaikoBeatmap {
    return super.applyToBeatmap(beatmap) as TaikoBeatmap;
  }

  /**
   * Applies osu!taiko ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods osu!taiko mod combination.
   * @returns A new osu!taiko beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: TaikoModCombination): TaikoBeatmap {
    return super.applyToBeatmapWithMods(beatmap, mods) as TaikoBeatmap;
  }

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns A new beatmap with no mods.
   */
  resetMods(beatmap: IBeatmap): TaikoBeatmap {
    return super.resetMods(beatmap) as TaikoBeatmap;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input?: number | string): TaikoModCombination {
    return new TaikoModCombination(input);
  }

  /**
   * @returns A new osu!taiko beatmap processor.
   */
  protected _createBeatmapProcessor(): TaikoBeatmapProcessor {
    return new TaikoBeatmapProcessor();
  }

  /**
   * @returns A new osu!taiko beatmap converter.
   */
  protected _createBeatmapConverter(): TaikoBeatmapConverter {
    return new TaikoBeatmapConverter();
  }

  /**
   * @returns A new osu!taiko replay converter.
   */
  protected _createReplayConverter(): TaikoReplayConverter {
    return new TaikoReplayConverter();
  }

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!taiko difficulty calculator.
   */
  createDifficultyCalculator(beatmap: IBeatmap): TaikoDifficultyCalculator {
    return new TaikoDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!taiko performance calculator.
   */
  createPerformanceCalculator(attributes?: TaikoDifficultyAttributes, score?: IScoreInfo): TaikoPerformanceCalculator {
    return new TaikoPerformanceCalculator(this, attributes, score);
  }
}
