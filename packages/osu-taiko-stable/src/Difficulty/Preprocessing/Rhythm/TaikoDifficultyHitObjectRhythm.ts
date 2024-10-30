/**
 * Represents a rhythm change in a taiko map.
 */
export class TaikoDifficultyHitObjectRhythm {
  /**
   * The difficulty multiplier associated with this rhythm change.
   */
  readonly difficulty: number;

  /**
   * The ratio of current difficulty hit object's delta time.
   * to previous difficulty hit object's delta time for the rhythm change.
   * A {@link ratio} above 1 indicates a slow-down;
   * A {@link ratio} below 1 indicates a speed-up.
   */
  readonly ratio: number;

  /**
   * Creates an object representing a rhythm change.
   * @param numerator The numerator for {@link ratio}.
   * @param denominator The denominator for {@link ratio}.
   * @param difficulty The difficulty multiplier associated with this rhythm change.
   */
  constructor(numerator: number, denominator: number, difficulty: number) {
    this.ratio = numerator / denominator;
    this.difficulty = difficulty;
  }
}
