import { HitSample } from './Sounds/HitSample';
import { IHitObject } from './IHitObject';
import { IHasDuration } from './Types/IHasDuration';

export interface IHoldableObject extends IHitObject, IHasDuration {
  /**
   * The length (in milliseconds) between ticks of this holdable object.
   */
  tickInterval: number;

  /**
   * The samples to be played when each node of this holdable object is hit.
   * 0: The first node.
   * 1: The first repeat.
   * 2: The second repeat.
   * ...
   * n-1: The last repeat.
   * n: The last node.
   */
  nodeSamples: HitSample[][];
}
