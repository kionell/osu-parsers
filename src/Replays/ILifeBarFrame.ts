/**
 * A life bar frame.
 */
export interface ILifeBarFrame {
  /**
   * Starting time of this life bar frame.
   */
  startTime: number;

  /**
   * The amount of HP at that current time.
   * This value is in range of 0-1.
   */
  health: number;

  /**
   * Create a new copy of this life bar frame. 
   * @returns A clone of life bar frame.
   */
  clone(): ILifeBarFrame;
}
