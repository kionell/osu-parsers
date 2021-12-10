import { HitObject } from 'osu-resources';

/**
 * A hittable object.
 */
export class HittableObject extends HitObject {
  /**
   * Creates a copy of this hittable object.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied hittable object.
   */
  clone(): HittableObject {
    const cloned = new HittableObject();

    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.startPosition = this.startPosition.clone();
    cloned.kiai = this.kiai;

    return cloned;
  }
}
