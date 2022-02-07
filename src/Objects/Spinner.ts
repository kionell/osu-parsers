import { StandardHitObject } from './StandardHitObject';
import { StandardEventGenerator } from './StandardEventGenerator';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  ISpinnableObject,
} from 'osu-classes';

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

  /**
   * The time at which this spinner ends.
   */
  endTime = 0;

  get duration(): number {
    return this.endTime - this.startTime;
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

    for (const nested of StandardEventGenerator.generateSpinnerTicks(this)) {
      this.nestedHitObjects.push(nested);
    }
  }

  clone(): this {
    const cloned = super.clone();

    cloned.endTime = this.endTime;
    cloned.spinsRequired = this.spinsRequired;
    cloned.maximumBonusSpins = this.maximumBonusSpins;

    return cloned;
  }
}
