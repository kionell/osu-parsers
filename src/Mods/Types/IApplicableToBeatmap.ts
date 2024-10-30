import { IBeatmap } from '../../Beatmaps/IBeatmap';
import { IMod } from '../IMod';

/**
 * Mod that applicable to the beatmap.
 */
export interface IApplicableToBeatmap extends IMod {
  /**
   * Applies a mod to the specified beatmap.
   * @param beatmap A beatmap.
   */
  applyToBeatmap(beatmap: IBeatmap): void;
}
