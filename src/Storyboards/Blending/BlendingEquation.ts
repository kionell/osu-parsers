export const enum BlendingEquation {
  /**
   * Inherits from parent.
   */
  Inherit,

  /**
   * Adds the source and destination colors.
   */
  Add,

  /**
   * Chooses the minimum of each component of the source and destination colors.
   */
  Min,

  /**
   * Chooses the maximum of each component of the source and destination colors.
   */
  Max,

  /**
   * Subtracts the destination color from the source color.
   */
  Subtract,

  /**
   * Subtracts the source color from the destination color.
   */
  ReverseSubtract,
}
