import { DifficultyHitObject, MathUtils } from 'osu-classes';
import { Spinner } from '../../Objects';
import { StandardDifficultyHitObject } from '../Preprocessing/StandardDifficultyHitObject';

/**
 * Represents the skill required to press keys with regards 
 * to keeping up with the speed at which objects need to be hit.
 */
export class SpeedEvaluator {
  private static _SINGLE_SPACING_THRESHOLD = 125;
  private static _MIN_SPEED_BONUS = 75; // ~200BPM
  private static _SPEED_BALANCING_FACTOR = 40;

  /**
   * Evaluates the difficulty of tapping the current object, based on:
   *  - time between pressing the previous and current object;
   *  - distance between those objects
   *  - and how easily they can be cheesed.
   * 
   * @param current Current difficulty hit object.
   * @returns Speed value at this {@link StandardDifficultyHitObject}.
   */
  static evaluateDifficultyOf(current: DifficultyHitObject): number {
    if (current.baseObject instanceof Spinner) return 0;

    /**
     * Derive strainTime for calculation
     */
    const osuCurrObj = current as StandardDifficultyHitObject;
    const osuPrevObj = current.index > 0 ? current.previous(0) as StandardDifficultyHitObject : null;
    const osuNextObj = current.next(0) as StandardDifficultyHitObject;

    let strainTime = osuCurrObj.strainTime;
    let doubletapness = 1;

    /**
     * Nerf doubletappable doubles.
     */
    if (osuNextObj !== null) {
      const currDeltaTime = Math.max(1, osuCurrObj.deltaTime);
      const nextDeltaTime = Math.max(1, osuNextObj.deltaTime);
      const deltaDifference = Math.abs(nextDeltaTime - currDeltaTime);
      const speedRatio = currDeltaTime / Math.max(currDeltaTime, deltaDifference);
      const windowRatio = Math.pow(Math.min(1, currDeltaTime / osuCurrObj.hitWindowGreat), 2);

      doubletapness = Math.pow(speedRatio, 1 - windowRatio);
    }

    /**
     * Cap deltatime to the OD 300 hitwindow.
     * 0.93 is derived from making sure 260bpm OD8 streams aren't 
     * nerfed harshly, whilst 0.92 limits the effect of the cap.
     */
    strainTime /= MathUtils.clamp((strainTime / osuCurrObj.hitWindowGreat) / 0.93, 0.92, 1);

    /**
     * Derive speedBonus for calculation.
     */
    let speedBonus = 1;

    if (strainTime < this._MIN_SPEED_BONUS) {
      speedBonus = 1 + 0.75 * Math.pow(
        (this._MIN_SPEED_BONUS - strainTime) / this._SPEED_BALANCING_FACTOR, 2,
      );
    }

    const travelDistance = osuPrevObj?.travelDistance ?? 0;
    const distance = Math.min(
      this._SINGLE_SPACING_THRESHOLD,
      travelDistance + osuCurrObj.minimumJumpDistance,
    );

    const pow = Math.pow(distance / this._SINGLE_SPACING_THRESHOLD, 3.5);

    return (speedBonus + speedBonus * pow) * doubletapness / strainTime;
  }
}
