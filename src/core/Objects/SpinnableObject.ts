import {
  ISpinnableObject,
  HitObject,
  IHasCombo,
} from 'osu-classes';

/**
 * A parsed spinnable object.
 */
export class SpinnableObject extends HitObject implements ISpinnableObject, IHasCombo {
  /**
   * The time at which the spinnable object ends.
   */
  endTime = 0;

  isNewCombo = false;
  comboOffset = 0;

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
  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;

    return cloned;
  }
}
