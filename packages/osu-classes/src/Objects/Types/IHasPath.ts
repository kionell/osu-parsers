import { SliderPath } from '../Path/SliderPath';
import { IHasDistance } from './IHasDistance';

/**
 * A hit object with path.
 */
export interface IHasPath extends IHasDistance {
  /**
   * The curve.
   */
  path: SliderPath;
}
