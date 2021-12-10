import { StandardEventGenerator } from './StandardEventGenerator';
import { StandardHitObject } from './StandardHitObject';
import { SliderHead } from './SliderHead';
import { SliderTail } from './SliderTail';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  Vector2,
  SliderPath,
  HitSample,
  ISlidableObject,
} from 'osu-resources';

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

  path: SliderPath = new SliderPath();

  nodeSamples: HitSample[][] = [];

  repeats = 0;

  startPosition: Vector2 = new Vector2(0, 0);

  get head(): SliderHead | null {
    const obj = this.nestedHitObjects.find((n) => n instanceof SliderHead);
    const head = obj as SliderHead;

    if (head) {
      head.startX = this.startX;
      head.startY = this.startY;
    }

    return head || null;
  }

  get tail(): SliderTail | null {
    const obj = this.nestedHitObjects.find((n) => n instanceof SliderTail);
    const tail = obj as SliderTail;

    if (tail) {
      tail.startX = this.endX;
      tail.startY = this.endY;
    }

    return tail || null;
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
      * difficulty.sliderMultiplier * difficultyPoint.speedMultiplier;

    this.velocity = scoringDistance / timingPoint.beatLength;
    this.tickDistance = (scoringDistance / difficulty.sliderTickRate) * this.tickRate;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of StandardEventGenerator.generateSliderTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  private _updateNestedPositions(): void {
    if (this.head !== null) {
      this.head.startPosition = this.startPosition;
    }

    if (this.tail !== null) {
      this.tail.startPosition = this.endPosition;
    }
  }

  clone(): Slider {
    const cloned = new Slider();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();
    cloned.kiai = this.kiai;
    cloned.tickDistance = this.tickDistance;
    cloned.tickRate = this.tickRate;
    cloned.legacyLastTickOffset = this.legacyLastTickOffset;
    cloned.stackHeight = this.stackHeight;
    cloned.scale = this.scale;

    return cloned;
  }
}
