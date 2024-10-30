import { PerformanceAttributes } from 'osu-classes';
import { StandardModCombination } from '../../Mods';

export class StandardPerformanceAttributes extends PerformanceAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: StandardModCombination;

  /**
   * The aim performance of a score.
   */
  aimPerformance = 0;

  /**
   * The speed performance of a score.
   */
  speedPerformance = 0;

  /**
   * The accuracy performance of a score.
   */
  accuracyPerformance = 0;

  /**
   * The flashlight performance of a score.
   */
  flashlightPerformance = 0;

  /**
   * Effective miss count.
   */
  effectiveMissCount = 0;

  /**
   * Creates new difficulty attributes.
   * @param mods The mods which were applied to the beatmap.
   * @param totalPerformance The total performance of a score.
   */
  constructor(mods: StandardModCombination, totalPerformance: number) {
    super(mods, totalPerformance);

    this.mods = mods;
  }
}
