import { ParsedHitObject } from './ParsedHitObject';

/**
 * A parsed spinnable object.
 */
export class ParsedSpinner extends ParsedHitObject {
  /**
   * The time at which the spinnable object ends.
   */
  endTime = 0;

  /**
   * Creates a copy of this parsed spinner.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed spinner.
   */
  clone(): ParsedSpinner {
    const cloned = new ParsedSpinner();

    cloned.startTime = this.startTime;
    cloned.endTime = this.endTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;

    cloned.samples = this.samples.map((s) => s.clone());
    cloned.startPosition = this.startPosition.clone();

    return cloned;
  }
}
