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

  tickInterval = 0;

  tickRate = 1;

  velocity = 1;

  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Normal;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Slider;
  }

  get head(): SliderHead | null {
    const head = this.nestedHitObjects.find((ho) => {
      return ho.nestedType === NestedType.Head;
    });

    return (head as SliderHead) || null;
  }

  get tail(): SliderTail | null {
    const tail = this.nestedHitObjects.find((ho) => {
      return ho.nestedType === NestedType.Tail;
    });

    return (tail as SliderTail) || null;
  }

  get pixelLength(): number {
    return (this.base as ISlidableObject).pixelLength || 0;
  }

  set pixelLength(value: number) {
    const slider = this.base as ISlidableObject;

    slider.pixelLength = value;

    if (slider.path) {
      slider.path.expectedDistance = value;

      slider.path.invalidate();
    }
  }

  get path(): SliderPath {
    return (this.base as ISlidableObject).path;
  }

  set path(value: SliderPath) {
    const slider = this.base as ISlidableObject;

    slider.path = value;
    slider.path.invalidate();
  }

  get nodeSamples(): HitSample[][] {
    return (this.base as ISlidableObject).nodeSamples || [this.base.samples];
  }

  set nodeSamples(value: HitSample[][]) {
    (this.base as ISlidableObject).nodeSamples = value;
  }

  get repeats(): number {
    return (this.base as ISlidableObject).repeats || 0;
  }

  set repeats(value: number) {
    (this.base as ISlidableObject).repeats = value;
  }

  get spans(): number {
    return this.repeats + 1;
  }

  get spanDuration(): number {
    return this.duration / this.spans;
  }

  get duration(): number {
    return (this.spans * this.path.distance) / this.velocity;
  }

  set duration(value: number) {
    this.velocity = (this.spans * this.path.distance) / value;
  }

  get startPosition(): Vector2 {
    return super.startPosition;
  }

  set startPosition(value: Vector2) {
    super.startPosition = value;

    this._updateNestedPositions();
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
