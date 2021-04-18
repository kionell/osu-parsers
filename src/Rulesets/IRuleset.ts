import { BeatmapProcessor } from '../Beatmaps/BeatmapProcessor';
import { BeatmapConverter } from '../Beatmaps/BeatmapConverter';
import { ModCombination } from '../Mods/ModCombination';
import { Beatmap } from '../Beatmaps';

/**
 * A ruleset.
 */
export interface IRuleset {
  /**
   * @returns A new beatmap processor.
   */
  createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  createBeatmapConverter(): BeatmapConverter;

  /**
   * @returns A new mod combination.
   */
  createModCombination(bitwise: number): ModCombination;

  applyMods(): Beatmap;
  resetMods(): Beatmap;
}
