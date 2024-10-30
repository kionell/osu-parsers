import { TaikoHitObject } from './TaikoHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

import { ISpinnableObject } from 'osu-classes';
import { TaikoHitWindows } from '../Scoring';

export class Swell extends TaikoHitObject implements ISpinnableObject {
  /**
   * The number of hits required to complete the swell successfully.
   */
  requiredHits = 10;

  /**
   * Ending time of this {@link Swell}
   */
  endTime = 0;

  hitWindows = TaikoHitWindows.empty;

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
