import { HitSample } from '../Sounds/HitSample';

/**
 * A hit object with node samples.
 */
export interface IHasNodeSamples {
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
