import { TaikoHitObject } from './TaikoHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

import { ISpinnableObject } from 'osu-resources';

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

  clone(): Swell {
    const cloned = new Swell();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.endTime = this.endTime;
    cloned.requiredHits = this.requiredHits;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;

    return cloned;
  }
}
