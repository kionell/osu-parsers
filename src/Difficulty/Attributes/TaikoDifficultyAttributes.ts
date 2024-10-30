import { DifficultyAttributes } from 'osu-classes';

export class TaikoDifficultyAttributes extends DifficultyAttributes {
  /**
   * The difficulty corresponding to the stamina skill.
   */
  staminaDifficulty = 0;

  /**
   * The difficulty corresponding to the rhythm skill.
   */
  rhythmDifficulty = 0;

  /**
   * The difficulty corresponding to the colour skill.
   */
  colourDifficulty = 0;

  /**
   * The difficulty corresponding to the hardest parts of the map.
   */
  peakDifficulty = 0;

  /**
   * The perceived hit window for a GREAT hit inclusive of rate-adjusting mods (DT/HT/etc).
   * Rate-adjusting mods don't directly affect the hit window, 
   * but have a perceived effect as a result of adjusting audio timing.
   */
  greatHitWindow = 0;
}
