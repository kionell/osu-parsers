import {
  BeatmapDifficultySection,
  ControlPointInfo,
  HitSample,
  IHasSliderVelocity,
  ISlidableObject,
  SliderPath,
} from 'osu-classes';

import { ConvertHitObject } from './ConvertHitObject';

/**
 * A parsed slidable object.
 * Used only for conversion between different rulesets.
 */
export class SlidableObject extends ConvertHitObject
  implements ISlidableObject, IHasSliderVelocity {
  /**
   * Scoring distance with a speed-adjusted beat length of 1 second
   * (ie. the speed slider balls move through their track).
   */
  static BASE_SCORING_DISTANCE = 100;

  /**
   * The duration of this slidable object.
   */
  get duration(): number {
    return this.spans * this.spanDuration;
  }

  /**
   * The time at which the slidable object ends.
   */
  get endTime(): number {
    return this.startTime + this.duration;
  }

  /**
   * The amount of times the length of this slidable object spans.
   */
  get spans(): number {
    return this.repeats + 1;
  }

  set spans(value: number) {
    this.repeats = value - 1;
  }

  /**
   * The duration of a single span of this slidable object.
   */
  get spanDuration(): number {
    return this.distance / this.velocity;
  }

  /**
   * The positional length of a slidable object.
   */
  get distance(): number {
    return this.path.distance;
  }

  set distance(value: number) {
    this.path.distance = value;
  }

  /**
   * The amount of times a slidable object repeats.
   */
  repeats = 0;

  /**
   * Velocity of this slidable object.
   */
  velocity = 1;

  /**
   * The slider velocity multiplier.
   */
  sliderVelocity = 1;

  /**
   * The curve of a slidable object.
   */
  path: SliderPath = new SliderPath();

  /**
   * The last tick offset of slidable objects in osu!stable.
   * This property shouldn't be here and will be removed soon.
   * @deprecated
   */
  legacyLastTickOffset = 36;

  /**
   * The samples to be played when each node of the slidable object is hit.
   * 0: The first node.
   * 1: The first repeat.
   * 2: The second repeat.
   * ...
   * n-1: The last repeat.
   * n: The last node.
   */
  nodeSamples: HitSample[][] = [];

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);

    const scoringDistance = SlidableObject.BASE_SCORING_DISTANCE
      * difficulty.sliderMultiplier * this.sliderVelocity;

    this.velocity = scoringDistance / timingPoint.beatLength;
  }

  /**
   * Creates a copy of this parsed slider.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed slider.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.legacyLastTickOffset = this.legacyLastTickOffset;
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();

    return cloned;
  }
}
