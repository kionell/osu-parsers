import {
  HitObject,
  HitSample,
  IHoldableObject,
} from 'osu-classes';

/**
 * A parsed holdable object.
 * Used only for conversion between different rulesets.
 */
export class HoldableObject extends HitObject implements IHoldableObject {
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
   * The duration of the holdable object.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * Creates a copy of this holdable object.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied holdable object.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.nestedHitObjects = this.nestedHitObjects.map((h) => h.clone());
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));

    return cloned;
  }
}
