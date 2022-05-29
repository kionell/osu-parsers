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
