/**
 * A hit object that ends at a different time than its start time.
 */
export interface IHasDuration {
  /**
   * The time at which the hit object ends.
   */
  endTime: number;

  /**
   * The duration of the hit object.
   */
  duration: number;
}
