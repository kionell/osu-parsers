import { TaikoHitObject } from './TaikoHitObject';
export class SwellTick extends TaikoHitObject {
  clone(): SwellTick {
    const cloned = new SwellTick();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;

    return cloned;
  }
}
