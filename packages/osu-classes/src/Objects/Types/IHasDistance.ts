import { IHasDuration } from './IHasDuration';

/**
 * A hit object that has a positional length.
 */
export interface IHasDistance extends IHasDuration {
  /**
   * The positional length of the hit object.
   */
  distance: number;
}
