/**
 * The type of pattern to generate. Used for legacy patterns.
 */
export enum PatternType {
  None = 0,

  /**
   * Keep the same as last row.
   */
  ForceStack = 1,

  /**
   * Keep different } from last row.
   */
  ForceNotStack = 1 << 1,

  /**
   * Keep as single note at its original position.
   */
  KeepSingle = 1 << 2,

  /**
   * Use a lower random value.
   */
  LowProbability = 1 << 3,

  /**
   * Reserved.
   */
  Alternate = 1 << 4,

  /**
   * Ignore the repeat count.
   */
  ForceSigSlider = 1 << 5,

  /**
   * Convert slider to circle.
   */
  ForceNotSlider = 1 << 6,

  /**
   * Notes gathered together.
   */
  Gathered = 1 << 7,
  Mirror = 1 << 8,

  /**
   * Change 0 -> 6.
   */
  Reverse = 1 << 9,

  /**
   * 1 -> 5 -> 1 -> 5 like reverse.
   */
  Cycle = 1 << 10,

  /**
   * Next note will be at column + 1.
   */
  Stair = 1 << 11,

  /**
   * Next note will be at column - 1.
   */
  ReverseStair = 1 << 12,
}
