/**
 * A type of hit object which may require the last tick to be offset.
 * This is specific to osu!stable conversion, and should not be used elsewhere.
 */
export interface IHasLegacyLastTickOffset {
  /**
   * Offset to the last tick.
   */
  legacyLastTickOffset?: number;
}
