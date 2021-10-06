import { BeatmapProcessor } from '../Beatmaps/BeatmapProcessor';
import { BeatmapConverter } from '../Beatmaps/BeatmapConverter';
import { RulesetBeatmap } from '../Beatmaps/RulesetBeatmap';
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
   * @returns A new beatmap processor.
   */
  createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  createBeatmapConverter(): BeatmapConverter;
}
