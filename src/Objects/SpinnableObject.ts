import {
  ISpinnableObject,
  HitObject,
} from 'osu-classes';

/**
 * A parsed spinnable object.
 */
export class SpinnableObject extends HitObject implements ISpinnableObject {
  /**
   * The time at which the spinnable object ends.
   */
  endTime = 0;

  /**
   * The duration of this spinnable object.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * Creates a copy of this parsed spinner.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed spinner.
   */
  clone(): SpinnableObject {
    const cloned = new SpinnableObject();

    cloned.startTime = this.startTime;
    cloned.endTime = this.endTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.startPosition = this.startPosition.clone();
    cloned.kiai = this.kiai;

    return cloned;
  }
}
