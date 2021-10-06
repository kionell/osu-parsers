import { HitSample } from 'osu-resources';

import { ParsedHitObject } from './ParsedHitObject';

/**
 * A parsed holdable object.
 */
export class ParsedHold extends ParsedHitObject {
  /**
   * The time at which the holdable object ends.
   */
  endTime = 0;

  /**
   * The samples to be played when each node of the holdable object is hit.
   * 0: The first node.
   * 1: The first repeat.
   * 2: The second repeat.
   * ...
   * n-1: The last repeat.
   * n: The last node.
   */
  nodeSamples: HitSample[][] = [];

  /**
   * Creates a copy of this parsed hold.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed hold.
   */
  clone(): ParsedHold {
    const cloned = new ParsedHold();

    cloned.startTime = this.startTime;
    cloned.endTime = this.endTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;

    cloned.samples = this.samples.map((s) => s.clone());
    cloned.startPosition = this.startPosition.clone();

    return cloned;
  }
}
