import { PerformanceAttributes } from 'osu-classes';
import { TaikoModCombination } from '../../Mods';

export class TaikoPerformanceAttributes extends PerformanceAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: TaikoModCombination;

  /**
   * The strain performance of a score.
   */
  strainPerformance = 0;

  /**
   * The accuracy performance of a score.
   */
  accuracyPerformance = 0;

  /**
   * Creates new difficulty attributes.
   * @param mods The mods which were applied to the beatmap.
   * @param totalPerformance The total performance of a score.
   */
  constructor(mods: TaikoModCombination, totalPerformance: number) {
    super(mods, totalPerformance);

    this.mods = mods;
  }
}
