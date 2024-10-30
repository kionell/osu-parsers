import { Vector2 } from '../../Types';
import { IHasX } from './IHasX';
import { IHasY } from './IHasY';

/**
 * A hit object that has a position.
 */
export interface IHasPosition extends IHasX, IHasY {
  /**
   * The position at which hit object starts.
   */
  startPosition: Vector2;

  /**
   * The position at which hit object ends.
   */
  endPosition: Vector2;
}
