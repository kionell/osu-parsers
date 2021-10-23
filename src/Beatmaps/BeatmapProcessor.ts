import { IBeatmap } from './IBeatmap';

/**
 * A beatmap processor.
 */
export abstract class BeatmapProcessor {
  /**
   * Performs beatmap pre-processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  preProcess(beatmap: IBeatmap): IBeatmap {
    return beatmap;
  }

  /**
   * Performs beatmap post processing. Mutates original beatmap.
   * @param beatmap A beatmap.
   * @returns The link to the same beatmap.
   */
  postProcess(beatmap: IBeatmap): IBeatmap {
    return beatmap;
  }
}
