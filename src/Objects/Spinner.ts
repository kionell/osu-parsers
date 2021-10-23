import { StandardHitObject } from './StandardHitObject';
import { StandardTickGenerator } from './StandardTickGenerator';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  ISpinnableObject,
  HitType,
} from 'osu-resources';

export class Spinner extends StandardHitObject implements ISpinnableObject {
  /**
   * Spinning doesn't match 1:1 with stable,
   * so let's fudge them easier for the time being.
   */
  static STABLE_MATCHING_FUDGE = 0.6;

  /**
   * Close to 477rpm.
   */
  static MAXIMUM_ROTATIONS = 8;

  /**
   * Number of spins required to finish the spinner without miss.
   */
  spinsRequired = 1;

  /**
   * Number of spins available to give bonus, beyond spinsRequired.
   */
  maximumBonusSpins = 1;

  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Normal;
    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Spinner;
  }

  get duration(): number {
    return (this.base as ISpinnableObject).endTime - this.startTime;
  }

  set duration(value: number) {
    (this.base as ISpinnableObject).endTime = this.startTime + value;
  }

  get endTime(): number {
    return (this.base as ISpinnableObject).endTime;
  }

  set endTime(value: number) {
    (this.base as ISpinnableObject).endTime = value;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    const secondsDuration = this.duration / 1000;

    const minimumRotations = Spinner.STABLE_MATCHING_FUDGE
      * BeatmapDifficultySection.range(difficulty.overallDifficulty, 3, 5, 7.5);

    const rotationDifference = Spinner.MAXIMUM_ROTATIONS - minimumRotations;

    this.spinsRequired = Math.trunc(secondsDuration * minimumRotations);
    this.maximumBonusSpins = Math.trunc(secondsDuration * rotationDifference);
  }

  createNestedHitObjects(): void {
    this.nestedHitObjects = [];

    for (const nested of StandardTickGenerator.generateSpinnerTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }
}
