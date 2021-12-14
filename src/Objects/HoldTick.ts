import { ManiaHitObject } from './ManiaHitObject';

export class HoldTick extends ManiaHitObject {
  clone(): HoldTick {
    const cloned = new HoldTick();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.originalColumn = this.originalColumn;
    cloned.column = this.column;

    return cloned;
  }
}
