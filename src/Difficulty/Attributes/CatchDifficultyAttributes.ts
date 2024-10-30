import { DifficultyAttributes } from 'osu-classes';

export class CatchDifficultyAttributes extends DifficultyAttributes {
  /**
   * The perceived approach rate inclusive of rate-adjusting mods (DT/HT/etc).
   * Rate-adjusting mods don't directly affect the approach rate difficulty value, 
   * but have a perceived effect as a result of adjusting audio timing.
   */
  approachRate = 0;
}
