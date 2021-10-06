import { BeatmapProcessor } from '../Beatmaps/BeatmapProcessor';
import { BeatmapConverter } from '../Beatmaps/BeatmapConverter';
import { RulesetBeatmap } from '../Beatmaps/RulesetBeatmap';
import { IBeatmap } from '../Beatmaps/IBeatmap';
import { IRuleset } from './IRuleset';

/**
 * A ruleset.
 */
export abstract class Ruleset implements IRuleset {
  /**
   * Ruleset ID.
   */
  abstract id: number;

  /**
   * Applies ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new instance of the beatmap with applied ruleset.
   */
  abstract applyToBeatmap(beatmap: IBeatmap): RulesetBeatmap;

  /**
   * @returns A new beatmap processor.
   */
  abstract createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  abstract createBeatmapConverter(): BeatmapConverter;
}
