import { DifficultyAttributes, ModBitwise } from 'osu-resources';

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

  *toDatabaseAttributes(): Generator<[number, number]> {
    yield [DifficultyAttributes.ATTRIB_ID_AIM, this.aimStrain];
    yield [DifficultyAttributes.ATTRIB_ID_SPEED, this.speedStrain];
    yield [DifficultyAttributes.ATTRIB_ID_OVERALL_DIFFICULTY, this.overallDifficulty];
    yield [DifficultyAttributes.ATTRIB_ID_APPROACH_RATE, this.approachRate];
    yield [DifficultyAttributes.ATTRIB_ID_MAX_COMBO, this.maxCombo];
    yield [DifficultyAttributes.ATTRIB_ID_STRAIN, this.starRating];

    if (this.shouldSerializeFlashlightRating) {
      yield [DifficultyAttributes.ATTRIB_ID_FLASHLIGHT, this.flashlightRating];
    }

    yield [DifficultyAttributes.ATTRIB_ID_SLIDER_FACTOR, this.sliderFactor];
  }

  fromDatabaseAttributes(values: {[key: number]: number}): void {
    this.aimStrain = values[DifficultyAttributes.ATTRIB_ID_AIM];
    this.speedStrain = values[DifficultyAttributes.ATTRIB_ID_SPEED];
    this.overallDifficulty = values[DifficultyAttributes.ATTRIB_ID_OVERALL_DIFFICULTY];
    this.approachRate = values[DifficultyAttributes.ATTRIB_ID_APPROACH_RATE];
    this.maxCombo = values[DifficultyAttributes.ATTRIB_ID_MAX_COMBO];
    this.starRating = values[DifficultyAttributes.ATTRIB_ID_STRAIN];
    this.flashlightRating = values[DifficultyAttributes.ATTRIB_ID_FLASHLIGHT] ?? 0;
    this.sliderFactor = values[DifficultyAttributes.ATTRIB_ID_SLIDER_FACTOR];
  }

  /**
   * Used implicitly to not serialize flashlight property in some cases.
   */
  get shouldSerializeFlashlightRating(): boolean {
    return this.mods.has(ModBitwise.Flashlight);
  }
}
