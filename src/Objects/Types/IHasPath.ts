import { SliderPath } from '../Path/SliderPath';
import { HitSample } from '../Sounds/HitSample';
import { IHasDuration } from './IHasDuration';

/**
 * A hit object with path.
 */
export interface IHasPath extends IHasDuration {
  /**
   * The positional length of the hit object.
   */
  pixelLength: number;

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

  /**
   * The curve.
   */
  path: SliderPath;

  /**
   * The samples to be played when each node of the IHasPath is hit.
   * 0: The first node.
   * 1: The first repeat.
   * 2: The second repeat.
   * ...
   * n-1: The last repeat.
   * n: The last node.
   */
  nodeSamples: HitSample[][];
}
