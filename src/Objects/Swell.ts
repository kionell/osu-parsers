import { TaikoHitObject } from './TaikoHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

import { HitType, ISpinnableObject } from 'osu-resources';

export class Swell extends TaikoHitObject implements ISpinnableObject {
  requiredHits = 10;

  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Normal;
    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Spinner;
  }

  get duration(): number {
    return (this.base as ISpinnableObject).endTime - this.startTime;
  }

  set duration(value: number) {
    (this.base as ISpinnableObject).endTime = this.startTime + value;
  }

  get endTime(): number {
    return (this.base as ISpinnableObject).endTime;
  }

  set endTime(value: number) {
    (this.base as ISpinnableObject).endTime = value;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of TaikoTickGenerator.generateSwellTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }
}
