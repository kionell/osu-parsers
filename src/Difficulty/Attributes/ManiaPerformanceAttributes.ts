import { PerformanceAttributes } from 'osu-classes';
import { ManiaModCombination } from '../../Mods';

/**
 * Describes the performance of a score, as output by a performance calculator.
 */
export class ManiaPerformanceAttributes extends PerformanceAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: ManiaModCombination;

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
  constructor(mods: ManiaModCombination, totalPerformance: number) {
    super(mods, totalPerformance);

    this.mods = mods;
  }
}
