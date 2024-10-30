export class RoundHelper {
  /**
   * Precision error to check if value is at midpoint.
   */
  static PRECISION_ERROR = 1e-15;

  /**
   * Rounds a value using "to even" or "away from zero" algroithm.
   * @param x The number to round.
   * @param mode Rounding mode.
   *  0 - "away from zero" algorithm.
   *  1 - "to even" algorithm.
   * 
   * @returns Rounded number using one of two algorithms.
   */
  static round(x: number, mode = 1): number {
    return mode ? this.roundToEven(x) : this.roundAwayFromZero(x);
  }

  /**
   * Rounds a value to the nearest number.
   * Midpoint values are rounded toward the nearest even number.
   * @param x The number to round.
   * @returns The rounded even number.
   */
  static roundToEven(x: number): number {
    return this.isAtMidPoint(x) ? 2 * Math.round(x / 2) : Math.round(x);
  }

  /**
   * Rounds a value to the nearest number.
   * Midpoint values are rounded toward the nearest number that's away from zero.
   * @param x The number to round.
   * @returns The rounded even number.
   */
  static roundAwayFromZero(x: number): number {
    return this.isAtMidPoint(x) ? (x > 0 ? Math.ceil(x) : Math.floor(x)) : Math.round(x);
  }

  /**
   * Checks if a number is at midpoint.
   * @param x The number to check.
   * @returns If the number is at midpoint.
   */
  static isAtMidPoint(x: number): boolean {
    return Math.abs(0.5 - Math.abs(x - (x >> 0))) <= this.PRECISION_ERROR;
  }
}
