import { CatchHitObject } from './CatchHitObject';

export abstract class PalpableHitObject extends CatchHitObject {
  hyperDashTarget: CatchHitObject | null = null;

  distanceToHyperDash = 0;

  get hasHyperDash(): boolean {
    return this.hyperDashTarget !== null;
  }

  clone(): this {
    const cloned = super.clone();

    cloned.hyperDashTarget = this.hyperDashTarget;
    cloned.distanceToHyperDash = this.distanceToHyperDash;

    return cloned;
  }
}
