import { DifficultyAttributes } from 'osu-classes';

export class ManiaDifficultyAttributes extends DifficultyAttributes {
  /**
   * The hit window for a GREAT hit inclusive of rate-adjusting mods (DT/HT/etc).
   * Rate-adjusting mods do not affect the hit window at all in osu-stable.
   */
  greatHitWindow = 0;

  /**
   * The score multiplier applied via score-reducing mods.
   */
  scoreMultiplier = 0;
}
