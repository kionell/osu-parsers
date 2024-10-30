import {
  ControlPointInfo,
  BeatmapDifficultySection,
  SliderPath,
  HitSample,
  ISlidableObject,
} from 'osu-classes';

import { TaikoStrongHitObject } from './TaikoStrongHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';
import { TaikoHitWindows } from '../Scoring';

export class DrumRoll extends TaikoStrongHitObject implements ISlidableObject {
  /**
   * Drum roll distance that results in a duration of 1 speed-adjusted beat length.
   */
  static readonly BASE_DISTANCE = 100;

  /**
   * The length (in milliseconds) between ticks of this drumroll.
   * Half of this value is the hit window of the ticks.
   */
  tickInterval = 100;

  /**
   * Numer of ticks per beat length.
   */
  tickRate = 1;

  /**
   * Velocity of this {@link DrumRoll}
   */
  velocity = 1;

  /**
   * Duration of this {@link DrumRoll}
   */
  duration = 0;

  /**
   * Path of this {@link DrumRoll}
   * For compatibility with slidable hit object interface.
   */
  path: SliderPath = new SliderPath();

  /**
   * Node samples of this {@link DrumRoll}
   * For compatibility with slidable hit object interface.
   */
  nodeSamples: HitSample[][] = [];

  /**
   * Repeats of this {@link DrumRoll}. 
   * For compatibility with slidable hit object interface.
   */
  repeats = 0;

  hitWindows = TaikoHitWindows.empty;

  get distance(): number {
    return this.path.distance;
  }

  set distance(value: number) {
    this.path.distance = value;
  }

  get spans(): number {
    return this.repeats + 1;
  }

  get spanDuration(): number {
    return this.duration / this.spans;
  }

  get endTime(): number {
    return this.startTime + this.duration;
  }

  set endTime(value: number) {
    this.duration = value - this.startTime;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);

    const scoringDistance = DrumRoll.BASE_DISTANCE
      * difficulty.sliderMultiplier * difficultyPoint.sliderVelocity;

    this.velocity = scoringDistance / timingPoint.beatLength;
    this.tickInterval = timingPoint.beatLength / this.tickRate;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of TaikoEventGenerator.generateDrumRollTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): this {
    const cloned = super.clone();

    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();
    cloned.tickRate = this.tickRate;
    cloned.tickInterval = this.tickInterval;
    cloned.duration = this.duration;

    return cloned;
  }
}
