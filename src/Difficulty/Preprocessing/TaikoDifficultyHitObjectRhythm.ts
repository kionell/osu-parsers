/**
 * Represents a rhythm change in a taiko map.
 */
export class TaikoDifficultyHitObjectRhythm {
  /**
   * The difficulty multiplier associated with this rhythm change.
   */
  readonly difficulty: number;

  /**
   * The ratio of current delta time to previous delta time for the rhythm change.
   * A ratio above 1 indicates a slow-down.
   * A ratio below 1 indicates a speed-up.
   */
  readonly ratio: number;

  /**
   * Creates an object representing a rhythm change.
   * @param numerator The numerator for ratio.
   * @param denominator The denominator for ratio.
   * @param difficulty The difficulty multiplier associated with this rhythm change.
   */
  constructor(numerator: number, denominator: number, difficulty: number) {
    this.ratio = numerator / denominator;
    this.difficulty = difficulty;
  }
}
