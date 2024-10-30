import { PerformanceAttributes } from 'osu-classes';
import { CatchModCombination } from '../../Mods';

/**
 * Describes the performance of a score, as output by a performance calculator.
 */
export class CatchPerformanceAttributes extends PerformanceAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: CatchModCombination;

  /**
   * Creates new difficulty attributes.
   * @param mods The mods which were applied to the beatmap.
   * @param totalPerformance The total performance of a score.
   */
  constructor(mods: CatchModCombination, totalPerformance: number) {
    super(mods, totalPerformance);

    this.mods = mods;
  }
}
