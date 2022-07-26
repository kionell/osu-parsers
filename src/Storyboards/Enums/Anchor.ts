/**
 * Origins of the storyboard sprite.
 */
export const enum Anchor {
  /**
   * The vertical counterpart is at "Top" position.
   */
  y0 = 1,

  /**
   * The vertical counterpart is at "Centre" position.
   */
  y1 = 1 << 1,

  /**
   * The vertical counterpart is at "Bottom" position.
   */
  y2 = 1 << 2,

  /**
   * The horizontal counterpart is at "Left" position.
   */
  x0 = 1 << 3,

  /**
   * The horizontal counterpart is at "Centre" position.
   */
  x1 = 1 << 4,

  /**
   * The horizontal counterpart is at "Right" position.
   */
  x2 = 1 << 5,

  /**
   * The user is manually updating the outcome.
   */
  Custom = 1 << 6,

  TopLeft = x0 | y0,
  TopCentre = x1 | y0,
  TopRight = x2 | y0,

  CentreLeft = x0 | y1,
  Centre = x1 | y1,
  CentreRight = x2 | y1,

  BottomLeft = x0 | y2,
  BottomCentre = x1 | y2,
  BottomRight = x2 | y2,
}
