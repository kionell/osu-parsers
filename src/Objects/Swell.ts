import { TaikoHitObject } from './TaikoHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

import { ISpinnableObject } from 'osu-classes';

export class Swell extends TaikoHitObject implements ISpinnableObject {
  requiredHits = 10;

  endTime = 0;

  get duration(): number {
    return this.endTime - this.startTime;
  }

  set duration(value: number) {
    this.endTime = this.startTime + value;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of TaikoEventGenerator.generateSwellTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.requiredHits = this.requiredHits;

    return cloned;
  }
}
