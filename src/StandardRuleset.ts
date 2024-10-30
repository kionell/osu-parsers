import {
  Ruleset,
  IScoreInfo,
  IBeatmap,
} from 'osu-classes';

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

import { StandardReplayConverter } from './Replays';
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
   * Applies osu!std ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new osu!std beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): StandardBeatmap {
    return super.applyToBeatmap(beatmap) as StandardBeatmap;
  }

  /**
   * Applies osu!std ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods osu!std mod combination.
   * @returns A new osu!std beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: StandardModCombination): StandardBeatmap {
    return super.applyToBeatmapWithMods(beatmap, mods) as StandardBeatmap;
  }

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns A new beatmap with no mods.
   */
  resetMods(beatmap: IBeatmap): StandardBeatmap {
    return super.resetMods(beatmap) as StandardBeatmap;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input?: number | string): StandardModCombination {
    return new StandardModCombination(input);
  }

  /**
   * @returns A new osu!std beatmap processor.
   */
  protected _createBeatmapProcessor(): StandardBeatmapProcessor {
    return new StandardBeatmapProcessor();
  }

  /**
   * @returns A new osu!std beatmap converter.
   */
  protected _createBeatmapConverter(): StandardBeatmapConverter {
    return new StandardBeatmapConverter();
  }

  /**
   * @returns A new osu!std replay converter.
   */
  protected _createReplayConverter(): StandardReplayConverter {
    return new StandardReplayConverter();
  }

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!std difficulty calculator.
   */
  createDifficultyCalculator(beatmap: IBeatmap): StandardDifficultyCalculator {
    return new StandardDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!std performance calculator.
   */
  createPerformanceCalculator(attributes?: StandardDifficultyAttributes, score?: IScoreInfo): StandardPerformanceCalculator {
    return new StandardPerformanceCalculator(this, attributes, score);
  }
}
