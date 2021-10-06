import { ParsedHitObject } from './ParsedHitObject';

/**
 * A parsed hittable object.
 */
export class ParsedHit extends ParsedHitObject {
  /**
   * Creates a copy of this parsed hit.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed hit.
   */
  clone(): ParsedHit {
    const cloned = new ParsedHit();

    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;

    cloned.samples = this.samples.map((s) => s.clone());
    cloned.startPosition = this.startPosition.clone();

    return cloned;
  }
}
