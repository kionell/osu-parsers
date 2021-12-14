import { DifficultyAttributes } from 'osu-resources';

export class CatchDifficultyAttributes extends DifficultyAttributes {
  approachRate = 0;

  *toDatabaseAttributes(): Generator<[number, number]> {
    // TODO: osu!catch should not output star rating in the 'aim' attribute.
    yield [DifficultyAttributes.ATTRIB_ID_AIM, this.starRating];
    yield [DifficultyAttributes.ATTRIB_ID_APPROACH_RATE, this.approachRate];
    yield [DifficultyAttributes.ATTRIB_ID_MAX_COMBO, this.maxCombo];
  }

  fromDatabaseAttributes(values: {[key: number]: number}): void {
    this.starRating = values[DifficultyAttributes.ATTRIB_ID_AIM];
    this.approachRate = values[DifficultyAttributes.ATTRIB_ID_APPROACH_RATE];
    this.maxCombo = +values[DifficultyAttributes.ATTRIB_ID_MAX_COMBO];
  }
}
