import {
  Ruleset,
  IBeatmap,
  IScoreInfo,
} from 'osu-classes';

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
import { CatchReplayConverter } from './Replays';

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
   * Applies osu!catch ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new osu!catch beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): CatchBeatmap {
    return super.applyToBeatmap(beatmap) as CatchBeatmap;
  }

  /**
   * Applies osu!catch ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods osu!catch mod combination.
   * @returns A new osu!catch beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: CatchModCombination): CatchBeatmap {
    return super.applyToBeatmapWithMods(beatmap, mods) as CatchBeatmap;
  }

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns A new beatmap with no mods.
   */
  resetMods(beatmap: IBeatmap): CatchBeatmap {
    return super.resetMods(beatmap) as CatchBeatmap;
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param input Mod bitwise or acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input?: number | string): CatchModCombination {
    return new CatchModCombination(input);
  }

  /**
   * @returns A new osu!catch beatmap processor.
   */
  protected _createBeatmapProcessor(): CatchBeatmapProcessor {
    return new CatchBeatmapProcessor();
  }

  /**
   * @returns A new osu!catch beatmap converter.
   */
  protected _createBeatmapConverter(): CatchBeatmapConverter {
    return new CatchBeatmapConverter();
  }

  /**
   * @returns A new osu!catch replay converter.
   */
  protected _createReplayConverter(): CatchReplayConverter {
    return new CatchReplayConverter();
  }

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new osu!catch difficulty calculator.
   */
  createDifficultyCalculator(beatmap: IBeatmap): CatchDifficultyCalculator {
    return new CatchDifficultyCalculator(beatmap, this);
  }

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new osu!catch performance calculator.
   */
  createPerformanceCalculator(attributes?: CatchDifficultyAttributes, score?: IScoreInfo): CatchPerformanceCalculator {
    return new CatchPerformanceCalculator(this, attributes, score);
  }
}
