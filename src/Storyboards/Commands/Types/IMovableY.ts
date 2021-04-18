/**
 * A storyboard command that moves elements along the Y coordinate.
 */
export interface IMovableY {
  /**
   * The Y-position at which element starts.
   */
  startY: number;

  /**
   * The Y-position at which element ends.
   */
  endY: number;
}
