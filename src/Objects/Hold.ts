import { ManiaHitObject } from './ManiaHitObject';
import { ManiaEventGenerator } from './ManiaEventGenerator';
import { HoldHead } from './HoldHead';
import { HoldTail } from './HoldTail';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  IHoldableObject,
  HitSample,
  HitType,
} from 'osu-classes';

export class Hold extends ManiaHitObject implements IHoldableObject {
  /**
   * The time between ticks of this hold.
   */
  tickInterval = 50;

  nodeSamples: HitSample[][] = [];

  /**
   * The time at which this hold ends.
   */
  endTime = 0;

  hitType: HitType = HitType.Hold;

  get duration(): number {
    return this.endTime - this.startTime;
  }

  get head(): HoldHead | null {
    const head = this.nestedHitObjects.find((n) => n instanceof HoldHead);

    if (head) {
      head.startTime = this.startTime;
    }

    return head as HoldHead || null;
  }

  get tail(): HoldTail | null {
    const tail = this.nestedHitObjects.find((n) => n instanceof HoldTail);

    if (tail) {
      tail.startTime = this.endTime;
    }

    return tail as HoldTail || null;
  }

  get column(): number {
    return this._column;
  }

  set column(value: number) {
    this._column = value;

    if (this.head) {
      this.head.column = value;
    }

    if (this.tail) {
      this.tail.column = value;
    }
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);

    this.tickInterval = timingPoint.beatLength / difficulty.sliderTickRate;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of ManiaEventGenerator.generateHoldTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.tickInterval = this.tickInterval;

    return cloned;
  }
}
