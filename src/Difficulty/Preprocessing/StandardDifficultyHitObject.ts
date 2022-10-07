import { DifficultyHitObject, HitResult, IHitObject, MathUtils, Vector2 } from 'osu-classes';
import { StandardHidden } from '../../Mods';
import { Slider, SliderRepeat, Spinner, StandardHitObject } from '../../Objects';

export class StandardDifficultyHitObject extends DifficultyHitObject {
  /**
   * A distance by which all distances should be scaled in order to assume a uniform circle size.
   */
  private static readonly NORMALIZED_RADIUS = 50;
  private static readonly MIN_DELTA_TIME = 25;
  private static readonly MAXIMUM_SLIDER_RADIUS = Math.fround(this.NORMALIZED_RADIUS * Math.fround(2.4));
  private static readonly ASSUMED_SLIDER_RADIUS = Math.fround(this.NORMALIZED_RADIUS * Math.fround(1.8));

  /**
   * Milliseconds elapsed since the start time of the previous  
   * {@link StandardDifficultyHitObject}, with a minimum of 25ms.
   */
  readonly strainTime: number;

  /**
   * Normalized distance from the end position of the previous 
   * {@link StandardDifficultyHitObject} to the start position of this {@link StandardDifficultyHitObject}.
   * The "lazy" end position is the position at which the cursor ends up if the previous hitobject 
   * is followed with as minimal movement as possible (i.e. on the edge of slider follow circles).
   */
  lazyJumpDistance = 0;

  /**
   * Normalised shortest distance to consider for a jump between the previou
   * {@link StandardDifficultyHitObject} and this {@link StandardDifficultyHitObject}.
   * This is bounded from above by {@link lazyJumpDistance}, and is smaller than the former 
   * if a more natural path is able to be taken through the previous {@link StandardDifficultyHitObject}.
   */
  minimumJumpDistance = 0;

  /**
   * The time taken to travel through {@link minimumJumpDistance}, with a minimum of 25ms.
   */
  minimumJumpTime = 0;

  /**
   * Normalised distance between the start and end position of this {@link StandardDifficultyHitObject}.
   */
  travelDistance = 0;

  /**
   * The time taken to travel through {@link travelDistance}, with a minimum value of 25ms {@link Slider} objects.
   */
  travelTime = 0;

  /**
   * Angle the player has to take to hit this {@link StandardDifficultyHitObject}.
   * Calculated as the angle between the circles (current-2, current-1, current).
   */
  angle: number | null = null;

  /**
   * Retrieves the full hit window for a Great {@link HitResult}.
   */
  hitWindowGreat = 0;

  readonly baseObject: StandardHitObject;
  readonly lastObject: StandardHitObject;
  private readonly _lastLastObject: StandardHitObject;

  constructor(
    hitObject: IHitObject,
    lastObject: IHitObject,
    lastLastObject: IHitObject | null,
    clockRate: number,
    objects: StandardDifficultyHitObject[],
    index: number,
  ) {
    super(hitObject, lastObject, clockRate, objects, index);

    this.baseObject = hitObject as StandardHitObject;
    this.lastObject = lastObject as StandardHitObject;
    this._lastLastObject = lastLastObject as StandardHitObject;

    /**
     * Capped to 25ms to prevent difficulty calculation breaking from simultaneous objects.
     */
    this.strainTime = Math.max(this.deltaTime, StandardDifficultyHitObject.MIN_DELTA_TIME);
    this.hitWindowGreat = this.baseObject instanceof Slider && this.baseObject.head
      ? 2 * this.baseObject.head.hitWindows.windowFor(HitResult.Great) / clockRate
      : 2 * this.baseObject.hitWindows.windowFor(HitResult.Great) / clockRate;

    this._setDistances(clockRate);
  }

  opacityAt(time: number, hidden: boolean): number {
    if (time > this.baseObject.startTime) return 0;

    const fadeInStartTime = this.baseObject.startTime - this.baseObject.timePreempt;
    const fadeInDuration = this.baseObject.timeFadeIn;

    if (hidden) {
      const fadeOutStartTime = this.baseObject.startTime
        - this.baseObject.timePreempt + this.baseObject.timeFadeIn;

      const fadeOutDuration = this.baseObject.timePreempt
        * StandardHidden.FADE_OUT_DURATION_MULTIPLIER;

      return Math.min(
        MathUtils.clamp((time - fadeInStartTime) / fadeInDuration, 0, 1),
        1.0 - MathUtils.clamp((time - fadeOutStartTime) / fadeOutDuration, 0, 1),
      );
    }

    return MathUtils.clamp((time - fadeInStartTime) / fadeInDuration, 0, 1);
  }

  private _setDistances(clockRate: number): void {
    const baseObj = this.baseObject as StandardHitObject;
    const lastObj = this.lastObject as StandardHitObject;

    if (baseObj instanceof Slider) {
      this._computeSliderCursorPosition(baseObj);

      this.travelDistance = Math.fround(
        Math.fround(baseObj.lazyTravelDistance) *
        Math.fround(Math.pow(1 + baseObj.repeats / 2.5, 1 / 2.5)),
      );

      this.travelTime = Math.max(
        baseObj.lazyTravelTime / clockRate,
        StandardDifficultyHitObject.MIN_DELTA_TIME,
      );
    }

    /**
     * We don't need to calculate either angle or distance 
     * when one of the last->curr objects is a spinner.
     */
    if (baseObj instanceof Spinner || lastObj instanceof Spinner) {
      return;
    }

    /**
     * We will scale distances by this factor, 
     * so we can assume a uniform CircleSize among beatmaps.
     */
    let scalingFactor = Math.fround(
      StandardDifficultyHitObject.NORMALIZED_RADIUS / Math.fround(baseObj.radius),
    );

    if (baseObj.radius < 30) {
      const smallCircleBonus = Math.fround(
        Math.min(Math.fround(30 - Math.fround(baseObj.radius)), 5) / 50,
      );

      scalingFactor *= 1 + smallCircleBonus;
    }

    const lastCursorPosition = this._getEndCursorPosition(lastObj);

    const scaledStackPos = baseObj.stackedStartPosition.fscale(scalingFactor);
    const scaledCursorPos = lastCursorPosition.fscale(scalingFactor);

    this.lazyJumpDistance = scaledStackPos.fsubtract(scaledCursorPos).flength();
    this.minimumJumpTime = this.strainTime;
    this.minimumJumpDistance = this.lazyJumpDistance;

    if (lastObj instanceof Slider) {
      const lastTraveTime = Math.max(
        lastObj.lazyTravelTime / clockRate,
        StandardDifficultyHitObject.MIN_DELTA_TIME,
      );

      this.minimumJumpTime = Math.max(
        this.strainTime - lastTraveTime,
        StandardDifficultyHitObject.MIN_DELTA_TIME,
      );

      const tailStackPos = lastObj.tail?.stackedStartPosition ?? lastObj.stackedStartPosition;
      const baseStackPos = baseObj.stackedStartPosition;

      const tailJumpDistance = Math.fround(
        tailStackPos.fsubtract(baseStackPos).flength() * scalingFactor,
      );

      const maxSliderRadius = StandardDifficultyHitObject.MAXIMUM_SLIDER_RADIUS;
      const assumedSliderRadius = StandardDifficultyHitObject.ASSUMED_SLIDER_RADIUS;

      this.minimumJumpDistance = MathUtils.clamp(
        this.lazyJumpDistance - (maxSliderRadius - assumedSliderRadius),
        0,
        tailJumpDistance - maxSliderRadius,
      );
    }

    if (this._lastLastObject !== null && !(this._lastLastObject instanceof Spinner)) {
      const lastLastCursorPosition = this._getEndCursorPosition(this._lastLastObject);

      const v1 = lastLastCursorPosition.fsubtract(lastObj.stackedStartPosition);
      const v2 = baseObj.stackedStartPosition.fsubtract(lastCursorPosition);

      const dot = v1.fdot(v2);
      const det = Math.fround(
        Math.fround(v1.floatX * v2.floatY) - Math.fround(v1.floatY * v2.floatX),
      );

      this.angle = Math.abs(Math.atan2(det, dot));
    }
  }

  private _computeSliderCursorPosition(slider: Slider): void {
    if (slider.lazyEndPosition) return;

    const lastNested = slider.nestedHitObjects[slider.nestedHitObjects.length - 1];

    slider.lazyTravelTime = lastNested.startTime - slider.startTime;

    let endTimeMin = slider.lazyTravelTime / slider.spanDuration;

    endTimeMin = endTimeMin % 2 >= 1 ? 1 - endTimeMin % 1 : endTimeMin % 1;

    const endPosition = slider.path.positionAt(endTimeMin);

    /**
     * Temporary lazy end position until a real result can be derived.
     */
    slider.lazyEndPosition = slider.stackedStartPosition.fadd(endPosition);

    let currCursorPosition = slider.stackedStartPosition;

    /**
     * Lazy slider distance is coded to be sensitive to scaling, 
     * this makes the maths easier with the thresholds being used.
     */
    const scalingFactor = StandardDifficultyHitObject.NORMALIZED_RADIUS / slider.radius;

    for (let i = 1; i < slider.nestedHitObjects.length; ++i) {
      const currMovementObj = slider.nestedHitObjects[i] as StandardHitObject;

      let currMovement = currMovementObj.stackedStartPosition.fsubtract(currCursorPosition);
      let currMovementLength = scalingFactor * currMovement.flength();

      /**
       * Amount of movement required so that the cursor position needs to be updated.
       */
      let requiredMovement = StandardDifficultyHitObject.ASSUMED_SLIDER_RADIUS;

      if (i === slider.nestedHitObjects.length - 1) {
        /**
         * The end of a slider has special aim rules due to the relaxed time constraint on position.
         * There is both a lazy end position as well as the actual end slider position. 
         * We assume the player takes the simpler movement.
         * For sliders that are circular, the lazy end position 
         * may actually be farther away than the sliders true end.
         * This code is designed to prevent buffing situations 
         * where lazy end is actually a less efficient movement.
         */
        const lazyMovement = slider.lazyEndPosition.fsubtract(currCursorPosition);

        if (lazyMovement.flength() < currMovement.flength()) {
          currMovement = lazyMovement;
        }

        currMovementLength = scalingFactor * currMovement.flength();
      }
      else if (currMovementObj instanceof SliderRepeat) {
        /**
         * For a slider repeat, assume a tighter movement 
         * threshold to better assess repeat sliders.
         */
        requiredMovement = StandardDifficultyHitObject.NORMALIZED_RADIUS;
      }

      if (currMovementLength > requiredMovement) {
        /**
         * This finds the positional delta from the required radius and the current position,
         * and updates the currCursorPosition accordingly, as well as rewarding distance.
         */
        const movementScale = Math.fround(
          (currMovementLength - requiredMovement) / currMovementLength,
        );

        currCursorPosition = currCursorPosition.fadd(currMovement.fscale(movementScale));
        currMovementLength *= (currMovementLength - requiredMovement) / currMovementLength;
        slider.lazyTravelDistance += Math.fround(currMovementLength);
      }

      if (i === slider.nestedHitObjects.length - 1) {
        slider.lazyEndPosition = currCursorPosition;
      }
    }
  }

  private _getEndCursorPosition(hitObject: StandardHitObject): Vector2 {
    let pos = hitObject.stackedStartPosition;

    if (hitObject instanceof Slider) {
      this._computeSliderCursorPosition(hitObject);
      pos = hitObject.lazyEndPosition ?? pos;
    }

    return pos;
  }
}
