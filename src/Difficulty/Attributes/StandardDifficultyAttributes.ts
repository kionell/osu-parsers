import { DifficultyAttributes, ModBitwise } from 'osu-classes';

export class StandardDifficultyAttributes extends DifficultyAttributes {
  aimStrain = 0;
  speedStrain = 0;
  flashlightRating = 0;
  sliderFactor = 0;
  approachRate = 0;
  overallDifficulty = 0;
  drainRate = 0;
  hitCircleCount = 0;
  sliderCount = 0;
  spinnerCount = 0;

  /**
   * Used implicitly to not serialize flashlight property in some cases.
   */
  get shouldSerializeFlashlightRating(): boolean {
    return this.mods.has(ModBitwise.Flashlight);
  }
}
