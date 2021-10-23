import { ManiaHitObject } from './ManiaHitObject';
import { ManiaTickGenerator } from './ManiaTickGenerator';
import { HoldHead } from './HoldHead';
import { HoldTail } from './HoldTail';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  HitSample,
  IHoldableObject,
  NestedType,
  HitType,
} from 'osu-resources';

export class Hold extends ManiaHitObject implements IHoldableObject {
  /**
   * The time between ticks of this hold.
   */
  tickInterval = 50;

  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Normal;
    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Spinner;

    return hitType | HitType.Hold;
  }

  get head(): HoldHead {
    const head = this.nestedHitObjects.find((ho) => {
      return ho.nestedType === NestedType.Head;
    });

    return (head as HoldHead) || null;
  }

  get tail(): HoldTail | null {
    const tail = this.nestedHitObjects.find((ho) => {
      return ho.nestedType === NestedType.Tail;
    });

    return (tail as HoldTail) || null;
  }

  get duration(): number {
    return this.endTime - this.startTime;
  }

  get startTime(): number {
    return this.base.startTime;
  }

  set startTime(value: number) {
    this.base.startTime = value;

    if (this.head !== null) {
      this.head.startTime = value;
    }

    if (this.tail !== null) {
      this.tail.startTime = this.endTime;
    }
  }

  get endTime(): number {
    return (this.base as IHoldableObject).endTime;
  }

  set endTime(value: number) {
    (this.base as IHoldableObject).endTime = value;

    if (this.tail !== null) {
      this.tail.startTime = value;
    }
  }

  get column(): number {
    return this._column;
  }

  set column(value: number) {
    this._column = value;

    if (this.head !== null) {
      this.head.column = value;
    }

    if (this.tail !== null) {
      this.tail.column = value;
    }
  }

  get nodeSamples(): HitSample[][] {
    return (this.base as IHoldableObject).nodeSamples || [this.base.samples];
  }

  set nodeSamples(value: HitSample[][]) {
    (this.base as IHoldableObject).nodeSamples = value;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);

    this.tickInterval = timingPoint.beatLength / difficulty.sliderTickRate;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of ManiaTickGenerator.generateHoldTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }
}
