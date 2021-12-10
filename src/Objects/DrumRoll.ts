import {
  ControlPointInfo,
  BeatmapDifficultySection,
  SliderPath,
  HitSample,
  HitType,
  ISlidableObject,
} from 'osu-resources';

import { TaikoStrongHitObject } from './TaikoStrongHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

export class DrumRoll extends TaikoStrongHitObject implements ISlidableObject {
  tickInterval = 100;

  tickDistance = 0;

  tickRate = 1;

  velocity = 1;

  duration = 0;

  requiredGoodHits = 0;

  requiredGreatHits = 0;

  overallDifficulty = 0;

  static BASE_DISTANCE: number = Math.fround(100);

  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Normal;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Slider;
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
    (this.base as ISlidableObject).path = value;
    (this.base as ISlidableObject).path.invalidate();
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

  get endTime(): number {
    return this.startTime + this.duration;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);

    const scoringDistance = DrumRoll.BASE_DISTANCE
      * difficulty.sliderMultiplier * difficultyPoint.speedMultiplier;

    this.velocity = scoringDistance / timingPoint.beatLength;
    this.tickInterval = timingPoint.beatLength / this.tickRate;

    this.overallDifficulty = difficulty.overallDifficulty;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of TaikoTickGenerator.generateDrumRollTicks(this)) {
      this.nestedHitObjects.push(nested);
    }

    this.requiredGoodHits = this.nestedHitObjects.length
      * Math.min(0.15, 0.05 + (0.1 / 6) * this.overallDifficulty);

    this.requiredGreatHits = this.nestedHitObjects.length
      * Math.min(0.3, 0.1 + (0.2 / 6) * this.overallDifficulty);
  }
}
