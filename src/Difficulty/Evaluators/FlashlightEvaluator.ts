import { DifficultyHitObject } from 'osu-classes';
import { Slider, Spinner, StandardHitObject } from '../../Objects';
import { StandardDifficultyHitObject } from '../Preprocessing';

export class FlashlightEvaluator {
  private static readonly MAX_OPACITY_BONUS = 0.4;
  private static readonly HIDDEN_BONUS = 0.2;
  private static readonly MIN_VELOCITY = 0.5;
  private static readonly SLIDER_MULTIPLIER = 1.3;
  private static readonly MIN_ANGLE_MULTIPLIER = 0.2;

  /**
   * Evaluates the difficulty of memorising and hitting an object, based on:
   *  - distance between a number of previous objects and the current object,
   *  - the visual opacity of the current object,
   *  - the angle made by the current object,
   *  - length and speed of the current object (for sliders),
   *  - and whether the hidden mod is enabled.
   * 
   * @param current Current difficulty hit object.
   * @param hidden Is for hidden mod?
   * @returns Flashlight value at this {@link StandardDifficultyHitObject}.
   */
  static evaluateDifficultyOf(current: DifficultyHitObject, hidden: boolean): number {
    if (current.baseObject instanceof Spinner) return 0;

    const osuCurrent = current as StandardDifficultyHitObject;
    const osuHitObject = osuCurrent.baseObject as StandardHitObject;

    const scalingFactor = 52 / osuHitObject.radius;
    let smallDistNerf = 1;
    let cumulativeStrainTime = 0;
    let result = 0;
    let angleRepeatCount = 0;
    let lastObj = osuCurrent;

    /**
     * This is iterating backwards in time from the current object.
     */
    for (let i = 0; i < Math.min(current.index, 10); i++) {
      const currentObj = current.previous(i) as StandardDifficultyHitObject;
      const currentHitObject = currentObj.baseObject as StandardHitObject;

      if (!(currentObj.baseObject instanceof Spinner)) {
        const jumpDistance = osuHitObject.stackedStartPosition
          .fsubtract(currentHitObject.stackedEndPosition)
          .flength();

        cumulativeStrainTime += lastObj.strainTime;

        /**
         * We want to nerf objects that can be easily 
         * seen within the Flashlight circle radius.
         */
        if (i === 0) {
          smallDistNerf = Math.min(1, jumpDistance / 75);
        }

        /**
         * We also want to nerf stacks so that only 
         * the first object of the stack is accounted for.
         */
        const stackNerf = Math.min(
          1, (currentObj.lazyJumpDistance / scalingFactor) / 25,
        );

        /**
         * Bonus based on how visible the object is.
         */
        const opacity = osuCurrent.opacityAt(currentHitObject.startTime, hidden);

        const opacityBonus = 1 + this.MAX_OPACITY_BONUS * (1 - opacity);

        result += stackNerf * opacityBonus * scalingFactor * jumpDistance / cumulativeStrainTime;

        if (currentObj.angle !== null && osuCurrent.angle !== null) {
          /**
           * Objects further back in time should count less for the nerf.
           */
          if (Math.abs(currentObj.angle - osuCurrent.angle) < 0.02) {
            angleRepeatCount += Math.max(1 - 0.1 * i, 0);
          }
        }
      }

      lastObj = currentObj;
    }

    result = Math.pow(smallDistNerf * result, 2.0);

    /**
     * Additional bonus for Hidden due to there being no approach circles.
     */
    if (hidden) result *= 1 + this.HIDDEN_BONUS;

    /**
     * Nerf patterns with repeated angles.
     */
    result *= this.MIN_ANGLE_MULTIPLIER
      + (1 - this.MIN_ANGLE_MULTIPLIER) / (angleRepeatCount + 1);

    let sliderBonus = 0;

    if (osuCurrent.baseObject instanceof Slider) {
      const slider = osuCurrent.baseObject;

      /**
       * Invert the scaling factor to determine 
       * the true travel distance independent of circle size.
       */
      const pixelTravelDistance = slider.lazyTravelDistance / scalingFactor;

      /**
       * Reward sliders based on velocity.
       */
      const max1 = Math.max(
        0, pixelTravelDistance / osuCurrent.travelTime - this.MIN_VELOCITY,
      );

      sliderBonus = Math.pow(max1, 0.5);

      /**
       * Longer sliders require more memorisation.
       */
      sliderBonus *= pixelTravelDistance;

      /**
       * Nerf sliders with repeats, as less memorisation is required.
       */
      if (slider.repeats > 0) {
        sliderBonus /= (slider.repeats + 1);
      }
    }

    result += sliderBonus * this.SLIDER_MULTIPLIER;

    return result;
  }
}
