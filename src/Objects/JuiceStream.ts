import { CatchHitObject } from './CatchHitObject';
import { CatchTickGenerator } from './CatchTickGenerator';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  HitSample,
  SliderPath,
  ISlidableObject,
  IHasLegacyLastTickOffset,
  HitType,
} from 'osu-resources';

export class JuiceStream extends CatchHitObject implements ISlidableObject, IHasLegacyLastTickOffset {
  static BASE_DISTANCE = 100;

  tickDistance = 100;

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

  get endX(): number {
    return this.originalX + this.path.curvePositionAt(1, this.spans).x;
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

  get endTime(): number {
    return this.startTime + this.duration;
  }

  get legacyLastTickOffset(): number {
    return (this.base as unknown as IHasLegacyLastTickOffset).legacyLastTickOffset || 0;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);

    const scoringDistance = JuiceStream.BASE_DISTANCE
      * difficulty.sliderMultiplier * difficultyPoint.speedMultiplier;

    this.tickRate = difficulty.sliderTickRate;

    this.tickInterval = timingPoint.beatLength / this.tickRate;
    this.tickDistance = scoringDistance / this.tickRate;

    this.velocity = scoringDistance / timingPoint.beatLength;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of CatchTickGenerator.generateDroplets(this)) {
      this.nestedHitObjects.push(nested);
    }
  }
}
