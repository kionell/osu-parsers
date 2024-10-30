import { DifficultyAttributes } from 'osu-classes';

export class StandardDifficultyAttributes extends DifficultyAttributes {
  /**
   * The difficulty corresponding to the aim skill.
   */
  aimDifficulty = 0;

  /**
   * The difficulty corresponding to the speed skill.
   */
  speedDifficulty = 0;

  /**
   * The number of clickable objects weighted by difficulty.
   * Related to {@link speedDifficulty}.
   */
  speedNoteCount = 0;

  /**
   * The difficulty corresponding to the flashlight skill.
   */
  flashlightDifficulty = 0;

  /**
   * Describes how much of {@link aimDifficulty} is contributed to by hitcircles or sliders.
   * A value closer to 1.0 indicates most of {@link aimDifficulty} is contributed by hitcircles.
   * A value closer to 0.0 indicates most of {@link aimDifficulty} is contributed by sliders.
   */
  sliderFactor = 0;

  /**
   * The perceived approach rate inclusive of rate-adjusting mods (DT/HT/etc).
   * Rate-adjusting mods don't directly affect the approach rate difficulty value, 
   * but have a perceived effect as a result of adjusting audio timing.
   */
  approachRate = 0;

  /**
   * The perceived overall difficulty inclusive of rate-adjusting mods (DT/HT/etc).
   * Rate-adjusting mods don't directly affect the overall difficulty value, 
   * but have a perceived effect as a result of adjusting audio timing.
   */
  overallDifficulty = 0;

  /**
   * The beatmap's drain rate. This doesn't scale with rate-adjusting mods.
   */
  drainRate = 0;

  /**
   * The number of hitcircles in the beatmap.
   */
  hitCircleCount = 0;

  /**
   * The number of sliders in the beatmap.
   */
  sliderCount = 0;

  /**
   * The number of spinners in the beatmap.
   */
  spinnerCount = 0;
}
