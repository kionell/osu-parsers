import { HitObject, IHasCombo } from 'osu-classes';

/**
 * A hittable object.
 */
export class HittableObject extends HitObject implements IHasCombo {
  isNewCombo = false;
  comboOffset = 0;

  /**
   * Creates a copy of this parsed hit.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed slider.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.isNewCombo = this.isNewCombo;
    cloned.comboOffset = this.comboOffset;

    return cloned;
  }
}
