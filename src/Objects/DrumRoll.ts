import {
  ControlPointInfo,
  BeatmapDifficultySection,
  SliderPath,
  HitSample,
  ISlidableObject,
} from 'osu-classes';

import { TaikoStrongHitObject } from './TaikoStrongHitObject';
import { TaikoEventGenerator } from './TaikoEventGenerator';

export class DrumRoll extends TaikoStrongHitObject implements ISlidableObject {
  static BASE_DISTANCE = 100;

  tickInterval = 100;

  tickRate = 1;

  velocity = 1;

  duration = 0;

  requiredGoodHits = 0;

  requiredGreatHits = 0;

  overallDifficulty = 0;

  path: SliderPath = new SliderPath();

  nodeSamples: HitSample[][] = [];

  repeats = 0;

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

    for (const nested of TaikoEventGenerator.generateDrumRollTicks(this)) {
      this.nestedHitObjects.push(nested);
    }

    this.requiredGoodHits = this.nestedHitObjects.length
      * Math.min(0.15, 0.05 + (0.1 / 6) * this.overallDifficulty);

    this.requiredGreatHits = this.nestedHitObjects.length
      * Math.min(0.3, 0.1 + (0.2 / 6) * this.overallDifficulty);
  }

  clone(): DrumRoll {
    const cloned = new DrumRoll();

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
    cloned.tickRate = this.tickRate;
    cloned.tickInterval = this.tickInterval;
    cloned.duration = this.duration;
    cloned.requiredGoodHits = this.requiredGoodHits;
    cloned.requiredGreatHits = this.requiredGreatHits;
    cloned.overallDifficulty = this.overallDifficulty;

    return cloned;
  }
}
