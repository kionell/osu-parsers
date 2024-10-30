import { PalpableHitObject } from './PalpableHitObject';

export class Banana extends PalpableHitObject {
  /**
   * The index of the current banana in the shower.
   */
  index = 0;

  clone(): this {
    const cloned = super.clone();

    cloned.index = this.index;

    return cloned;
  }
}
