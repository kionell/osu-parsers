import { ISpinnableObject } from 'osu-classes';
import { ConvertHitObject } from './ConvertHitObject';

/**
 * A parsed spinnable object.
 * Used only for conversion between different rulesets.
 */
export class SpinnableObject extends ConvertHitObject implements ISpinnableObject {
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

  set duration(value: number) {
    this.endTime = this.startTime + value;
  }

  /**
   * Creates a copy of this parsed spinner.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed spinner.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;

    return cloned;
  }
}
