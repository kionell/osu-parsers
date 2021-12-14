import { PalpableHitObject } from './PalpableHitObject';

export class Banana extends PalpableHitObject {
  /**
   * The index of the current banana in the shower.
   */
  index = 0;

  clone(): Banana {
    const cloned = new Banana();

    cloned.startPosition = this.startPosition.clone();
    cloned.startX = this.startX;
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.timePreempt = this.timePreempt;
    cloned.scale = this.scale;
    cloned.offsetX = this.offsetX;
    cloned.hyperDashTarget = this.hyperDashTarget;
    cloned.distanceToHyperDash = this.distanceToHyperDash;
    cloned.index = this.index;

    return cloned;
  }
}
