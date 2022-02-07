import { ISpinnableObject } from 'osu-classes';
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

  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;

    return cloned;
  }
}
