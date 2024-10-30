import {
  Ruleset,
  IBeatmap,
  IScoreInfo,
} from 'osu-classes';

import {
  ManiaBeatmapProcessor,
  ManiaBeatmapConverter,
  ManiaBeatmap,
} from './Beatmaps';

import {
  ManiaDifficultyAttributes,
  ManiaDifficultyCalculator,
  ManiaPerformanceCalculator,
} from './Difficulty';

import { ManiaModCombination } from './Mods/ManiaModCombination';
import { ManiaReplayConverter } from './Replays';

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
   * Applies osu!mania ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new osu!mania beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): ManiaBeatmap {
    return super.applyToBeatmap(beatmap) as ManiaBeatmap;
  }

  /**
   * Applies osu!mania ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods osu!mania mod combination.
   * @returns A new osu!mania beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: ManiaModCombination): ManiaBeatmap {
    return super.applyToBeatmapWithMods(beatmap, mods) as ManiaBeatmap;
  }

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns A new beatmap with no mods.
   */
  resetMods(beatmap: IBeatmap): ManiaBeatmap {
    return super.resetMods(beatmap) as ManiaBeatmap;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input?: number | string): ManiaModCombination {
    return new ManiaModCombination(input);
  }

  /**
   * @returns A new osu!mania beatmap processor.
   */
  protected _createBeatmapProcessor(): ManiaBeatmapProcessor {
    return new ManiaBeatmapProcessor();
  }

  /**
   * @returns A new osu!mania beatmap converter.
   */
  protected _createBeatmapConverter(): ManiaBeatmapConverter {
    return new ManiaBeatmapConverter();
  }

  /**
   * @returns A new osu!mania replay converter.
   */
  protected _createReplayConverter(): ManiaReplayConverter {
    return new ManiaReplayConverter();
  }

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!mania difficulty calculator.
   */
  createDifficultyCalculator(beatmap: IBeatmap): ManiaDifficultyCalculator {
    return new ManiaDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!mania performance calculator.
   */
  createPerformanceCalculator(attributes?: ManiaDifficultyAttributes, score?: IScoreInfo): ManiaPerformanceCalculator {
    return new ManiaPerformanceCalculator(this, attributes, score);
  }
}
