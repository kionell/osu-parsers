import {
  ControlPointInfo,
  BeatmapDifficultySection,
  Vector2,
  SliderPath,
  HitSample,
  ISlidableObject,
} from 'osu-classes';

import { StandardEventGenerator } from './StandardEventGenerator';
import { StandardHitObject } from './StandardHitObject';
import { SliderHead } from './SliderHead';
import { SliderTail } from './SliderTail';
import { StandardHitWindows } from '../Scoring';

export class Slider extends StandardHitObject implements ISlidableObject {
  tickDistance = 0;

  tickRate = 1;

  velocity = 1;

  legacyLastTickOffset?: number;

  /**
   * The position of the cursor at the point of completion of this slider if it was hit
   * with as few movements as possible. This is set and used by difficulty calculation.
   */
  lazyEndPosition?: Vector2;

  /**
   * The distance travelled by the cursor upon completion of this slider if it was hit
   * with as few movements as possible. This is set and used by difficulty calculation.
   */
  lazyTravelDistance = 0;

  /**
   * The time taken by the cursor upon completion of this slider if it was hit
   * with as few movements as possible. This is set and used by difficulty calculation.
   */
  lazyTravelTime = 0;

  hitWindows = StandardHitWindows.empty;

  path: SliderPath = new SliderPath();

  nodeSamples: HitSample[][] = [];

  repeats = 0;

  startPosition: Vector2 = new Vector2(0, 0);

  get startX(): number {
    this._updateHeadPosition();

    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
    this._updateHeadPosition();
  }

  get startY(): number {
    this._updateHeadPosition();

    return this.startPosition.y;
  }

  set startY(value: number) {
    this.startPosition.y = value;
    this._updateHeadPosition();
  }

  get endX(): number {
    this._updateTailPosition();

    return this.endPosition.x;
  }

  set endX(value: number) {
    this.endPosition.x = value;
    this._updateTailPosition();
  }

  get endY(): number {
    this._updateTailPosition();

    return this.endPosition.y;
  }

  set endY(value: number) {
    this.endPosition.y = value;
    this._updateTailPosition();
  }

  get head(): SliderHead | null {
    const obj = this.nestedHitObjects.find((n) => n instanceof SliderHead);

    return obj as SliderHead || null;
  }

  get tail(): SliderTail | null {
    const obj = this.nestedHitObjects.find((n) => n instanceof SliderTail);

    return obj as SliderTail || null;
  }

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
    return this.path.distance / this.velocity;
  }

  get duration(): number {
    return this.spans * this.spanDuration;
  }

  set duration(value: number) {
    this.velocity = this.spans * this.distance / value;
  }

  get endPosition(): Vector2 {
    const endPoint = this.path.curvePositionAt(1, this.spans);

    /**
     * If endPosition could not be calculated,
     * approximate it by setting it to the last point
     */
    if (isFinite(endPoint.x) && isFinite(endPoint.y)) {
      return this.startPosition.add(endPoint);
    }

    const controlPoints = this.path.controlPoints;

    if (controlPoints.length) {
      return controlPoints[controlPoints.length - 1].position;
    }

    return this.startPosition;
  }

  get endTime(): number {
    return this.startTime + this.duration;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);

    const scoringDistance = StandardHitObject.BASE_SCORING_DISTANCE
      * difficulty.sliderMultiplier * difficultyPoint.sliderVelocity;

    const generateTicks = difficultyPoint.generateTicks;

    this.velocity = scoringDistance / timingPoint.beatLength;
    this.tickDistance = generateTicks
      ? (scoringDistance / difficulty.sliderTickRate) * this.tickRate
      : Infinity;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of StandardEventGenerator.generateSliderTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  private _updateHeadPosition(): void {
    if (this.head !== null) {
      this.head.startPosition = this.startPosition;
    }
  }

  private _updateTailPosition(): void {
    if (this.tail !== null) {
      this.tail.startPosition = this.endPosition;
    }
  }

  /**
   * Creates a deep copy of this slider.
   * @returns Cloned slider.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();
    cloned.tickDistance = this.tickDistance;
    cloned.tickRate = this.tickRate;
    cloned.legacyLastTickOffset = this.legacyLastTickOffset;

    return cloned;
  }
}
