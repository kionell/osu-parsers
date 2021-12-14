import { DifficultyAttributes } from 'osu-classes';

export class TaikoDifficultyAttributes extends DifficultyAttributes {
  staminaStrain = 0;
  rhythmStrain = 0;
  colourStrain = 0;
  approachRate = 0;
  greatHitWindow = 0;

  *toDatabaseAttributes(): Generator<[number, number]> {
    yield [DifficultyAttributes.ATTRIB_ID_MAX_COMBO, this.maxCombo];
    yield [DifficultyAttributes.ATTRIB_ID_STRAIN, this.starRating];
    yield [DifficultyAttributes.ATTRIB_ID_GREAT_HIT_WINDOW, this.greatHitWindow];
  }

  fromDatabaseAttributes(values: {[key: number]: number}): void {
    this.maxCombo = +values[DifficultyAttributes.ATTRIB_ID_MAX_COMBO];
    this.starRating = values[DifficultyAttributes.ATTRIB_ID_STRAIN];
    this.greatHitWindow = values[DifficultyAttributes.ATTRIB_ID_GREAT_HIT_WINDOW];
  }
}
