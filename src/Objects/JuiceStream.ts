import {
  ControlPointInfo,
  BeatmapDifficultySection,
  HitSample,
  SliderPath,
  ISlidableObject,
} from 'osu-classes';

import { CatchHitObject } from './CatchHitObject';
import { CatchEventGenerator } from './CatchEventGenerator';
import { CatchPlayfield } from '../UI/CatchPlayfield';

export class JuiceStream extends CatchHitObject implements ISlidableObject {
  static BASE_DISTANCE = 100;

  tickDistance = 100.0;

  velocity = 1.0;

  legacyLastTickOffset?: number;

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

  get duration(): number {
    return (this.spans * this.path.distance) / this.velocity;
  }

  set duration(value: number) {
    this.velocity = (this.spans * this.path.distance) / value;
  }

  get endTime(): number {
    return this.startTime + this.duration;
  }

  get endX(): number {
    return CatchPlayfield.clampToPlayfield(
      this.effectiveX + this.path.curvePositionAt(1, this.spans).x,
    );
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const timingPoint = controlPoints.timingPointAt(this.startTime);
    const difficultyPoint = controlPoints.difficultyPointAt(this.startTime);

    const scoringDistance = JuiceStream.BASE_DISTANCE * difficulty.sliderMultiplier;

    const tickDistanceFactor = scoringDistance / difficulty.sliderTickRate;
    const velocityFactor = scoringDistance / timingPoint.beatLength;

    this.tickDistance = tickDistanceFactor * difficultyPoint.sliderVelocity;
    this.velocity = velocityFactor * difficultyPoint.sliderVelocity;
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of CatchEventGenerator.generateDroplets(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): this {
    const cloned = super.clone();

    cloned.nodeSamples = this.nodeSamples.map((n) => n.map((s) => s.clone()));
    cloned.velocity = this.velocity;
    cloned.repeats = this.repeats;
    cloned.path = this.path.clone();
    cloned.tickDistance = this.tickDistance;
    cloned.legacyLastTickOffset = this.legacyLastTickOffset;

    return cloned;
  }
}
