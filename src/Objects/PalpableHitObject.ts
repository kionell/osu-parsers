import { CatchHitObject } from './CatchHitObject';

export abstract class PalpableHitObject extends CatchHitObject {
  hyperDashTarget: CatchHitObject | null = null;

  distanceToHyperDash = 0;

  get hasHyperDash(): boolean {
    return this.hyperDashTarget !== null;
  }
}
