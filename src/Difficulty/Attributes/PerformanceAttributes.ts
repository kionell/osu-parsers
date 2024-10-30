import { ModCombination } from '../../Mods/ModCombination';

/**
 * Describes the performance of a score, as output by a performance calculator.
 */
export abstract class PerformanceAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: ModCombination;

  /**
   * The total performance of a score.
   */
  totalPerformance: number;

  /**
   * Creates new difficulty attributes.
   * @param mods The mods which were applied to the beatmap.
   * @param totalPerformance The total performance of a score.
   */
  constructor(mods: ModCombination, totalPerformance: number) {
    this.mods = mods;
    this.totalPerformance = totalPerformance;
  }
}
