import { DifficultyAttributes } from 'osu-classes';

export class ManiaDifficultyAttributes extends DifficultyAttributes {
  greatHitWindow = 0;
  scoreMultiplier = 0;

  *toDatabaseAttributes(): Generator<[number, number]> {
    // TODO: osu!mania doesn't output MaxCombo attribute for some reason.
    yield [DifficultyAttributes.ATTRIB_ID_STRAIN, this.starRating];
    yield [DifficultyAttributes.ATTRIB_ID_GREAT_HIT_WINDOW, this.greatHitWindow];
    yield [DifficultyAttributes.ATTRIB_ID_SCORE_MULTIPLIER, this.scoreMultiplier];
  }

  fromDatabaseAttributes(values: {[key: number]: number}): void {
    this.starRating = values[DifficultyAttributes.ATTRIB_ID_STRAIN];
    this.greatHitWindow = values[DifficultyAttributes.ATTRIB_ID_GREAT_HIT_WINDOW];
    this.scoreMultiplier = values[DifficultyAttributes.ATTRIB_ID_SCORE_MULTIPLIER];
  }
}
