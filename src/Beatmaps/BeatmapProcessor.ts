import { Beatmap } from './Beatmap';

/**
 * A beatmap processor.
 */
export abstract class BeatmapProcessor {
  /**
   * Performs beatmap pre-processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  preProcess(beatmap: Beatmap): Beatmap {
    return beatmap;
  }

  /**
   * Performs beatmap post processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  postProcess(beatmap: Beatmap): Beatmap {
    return beatmap;
  }
}
