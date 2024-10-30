import { IHasNodeSamples } from './IHasNodeSamples';
import { IHasDuration } from './IHasDuration';

/**
 * A hit object that spans some length.
 */
export interface IHasRepeats extends IHasDuration, IHasNodeSamples {
  /**
   * The amount of times the hit object repeats.
   */
  repeats: number;

  /**
   * The number of spans of the hit object.
   */
  spans: number;

  /**
   * The duration of a single span.
   */
  spanDuration: number;
}
