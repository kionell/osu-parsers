import {
  RulesetBeatmap,
  IBeatmap,
} from '../Beatmaps';

import {
  IReplay,
  Replay,
} from '../Replays';

import {
  DifficultyAttributes,
  DifficultyCalculator,
  PerformanceCalculator,
} from '../Difficulty';

import { IScoreInfo } from '../Scoring';
import { ModCombination } from '../Mods';

/**
 * A ruleset.
 */
export interface IRuleset {
  /**
   * Ruleset ID.
   */
  id: number;

  /**
   * Applies ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new instance of the beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): RulesetBeatmap;

  /**
   * Applies ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods Mod combination.
   * @returns A new beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: ModCombination): RulesetBeatmap;

  /**
   * Applies ruleset to a replay.
   * Converts legacy replay frames to ruleset specific frames.
   * @param replay The replay.
   * @param beatmap The beatmap of the replay which is used to get some data.
   * @returns A new instance of the replay with applied ruleset.
   */
  applyToReplay(replay: IReplay, beatmap?: IBeatmap): Replay;

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns The same beatmap.
   */
  resetMods(beatmap: RulesetBeatmap): RulesetBeatmap;

  /**
   * Creates a new mod combination by converting legacy mod bitwise or string acronyms.
   * @param input Mod bitwise or string acronyms.
   * @returns A new mod combination.
   */
  createModCombination(input?: number | string): ModCombination;

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new difficulty calculator.
   */
  createDifficultyCalculator(beatmap: IBeatmap): DifficultyCalculator;

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new performance calculator.
   */
  createPerformanceCalculator(attributes?: DifficultyAttributes, score?: IScoreInfo): PerformanceCalculator;
}
