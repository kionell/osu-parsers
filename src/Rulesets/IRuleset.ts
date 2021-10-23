import { BeatmapProcessor } from '../Beatmaps/BeatmapProcessor';
import { BeatmapConverter } from '../Beatmaps/BeatmapConverter';
import { RulesetBeatmap } from '../Beatmaps/RulesetBeatmap';
import { ModCombination } from '../Mods/ModCombination';
import { IBeatmap } from '../Beatmaps/IBeatmap';

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
  applyToBeatmapWithMods(beatmap: IBeatmap, mods: ModCombination): RulesetBeatmap;

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns The same beatmap.
   */
  resetMods(beatmap: RulesetBeatmap): RulesetBeatmap;

  /**
   * Creates a new mod combination by converting legacy mod bitwise.
   * @param bitwise Mod bitwise.
   * @returns A new mod combination.
   */
  createModCombination(bitwise: number): ModCombination;

  /**
   * @returns A new beatmap processor.
   */
  createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  createBeatmapConverter(): BeatmapConverter;
}
