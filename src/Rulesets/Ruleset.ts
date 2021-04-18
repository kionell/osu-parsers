import { BeatmapProcessor } from '../Beatmaps/BeatmapProcessor';
import { BeatmapConverter } from '../Beatmaps/BeatmapConverter';
import { ModCombination } from '../Mods/ModCombination';

import { IRuleset } from './IRuleset';
import { Beatmap } from '../Beatmaps';

/**
 * A ruleset.
 */
export abstract class Ruleset implements IRuleset {
  /**
   * @returns A new beatmap processor.
   */
  abstract createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  abstract createBeatmapConverter(): BeatmapConverter;

  /**
   * @returns A new mod combination.
   */
  abstract createModCombination(bitwise: number): ModCombination;

  applyMods(): Beatmap {
    throw new Error('Method not implemented.');
  }

  resetMods(): Beatmap {
    throw new Error('Method not implemented.');
  }
}
