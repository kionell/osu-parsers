import { ISpinnableObject } from 'osu-resources';
import { CatchHitObject } from './CatchHitObject';
import { CatchEventGenerator } from './CatchEventGenerator';

export class BananaShower extends CatchHitObject implements ISpinnableObject {
  /**
   * The time at which this hit object ends.
   */
  endTime = 0;

  get duration(): number {
    return this.endTime - this.startTime;
  }

  set duration(value: number) {
    this.endTime = this.startTime + value;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of CatchEventGenerator.generateBananas(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): BananaShower {
    const cloned = new BananaShower();

    cloned.startPosition = this.startPosition.clone();
    cloned.startX = this.startX;
    cloned.startTime = this.startTime;
    cloned.endTime = this.endTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.timePreempt = this.timePreempt;
    cloned.scale = this.scale;
    cloned.offsetX = this.offsetX;

    return cloned;
  }
}
