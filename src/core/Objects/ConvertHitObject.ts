import { HitObject, IHasCombo } from 'osu-classes';

/**
 * A parsed hit object.
 * Used only for conversion between different rulesets.
 */
export class ConvertHitObject extends HitObject implements IHasCombo {
  isNewCombo = false;
  comboOffset = 0;

  /**
   * Creates a copy of this object.
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
