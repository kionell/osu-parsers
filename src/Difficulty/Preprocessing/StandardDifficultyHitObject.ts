import { DifficultyHitObject, IHitObject, Vector2 } from 'osu-classes';
import { Slider, SliderRepeat, Spinner, StandardHitObject } from '../../Objects';

export class StandardDifficultyHitObject extends DifficultyHitObject {
  /**
   * Change radius to 50 to make 100 the diameter. Easier for mental maths.
   */
  private _NORMALIZED_RADIUS = 50;
  private _MIN_DELTA_TIME = 25;
  private _MAXIMUM_SLIDER_RADIUS = this._NORMALIZED_RADIUS * Math.fround(2.4);
  private _ASSUMED_SLIDER_RADIUS = this._NORMALIZED_RADIUS * Math.fround(1.8);

  /**
   * Normalized distance from the end position of the previous 
   * difficulty hit object to the start position of this difficulty hit object.
   */
  jumpDistance = 0;

  /**
   * Minimum distance from the end position of the previous difficulty hit object 
   * to the start position of this difficulty hit object.
   */
  movementDistance = 0;

  /**
   * Normalized distance between the start and end position 
   * of the previous difficulty hit object.
   */
  travelDistance = 0;

  /**
   * Angle the player has to take to hit this difficulty hit object.
   * Calculated as the angle between the circles (current-2, current-1, current).
   */
  angle: number | null = null;

  /**
   * Milliseconds elapsed since the end time of the previous 
   * difficulty hit object, with a minimum of 25ms.
   */
  movementTime = 0;

  /**
   * Milliseconds elapsed since the start time of the previous difficulty hit object 
   * to the end time of the same previous difficulty hit object, with a minimum of 25ms.
   */
  travelTime = 0;

  /**
   * Milliseconds elapsed since the start time of the previous 
   * difficulty hit object, with a minimum of 25ms.
   */
  readonly strainTime: number;

  private readonly _lastLastObject: StandardHitObject;
  private readonly _lastObject: StandardHitObject;

  constructor(hitObject: IHitObject, lastLastObject: IHitObject | null, lastObject: IHitObject, clockRate: number) {
    super(hitObject, lastObject, clockRate);

    this._lastLastObject = lastLastObject as StandardHitObject;
    this._lastObject = lastObject as StandardHitObject;

    /**
     * Capped to 25ms to prevent difficulty calculation breaking from simultaneous objects.
     */
    this.strainTime = Math.max(this.deltaTime, this._MIN_DELTA_TIME);

    this._setDistances(clockRate);
  }

  private _setDistances(clockRate: number): void {
    const baseObj = this.baseObject as StandardHitObject;
    const lastObj = this.lastObject as StandardHitObject;

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
    let scalingFactor = Math.fround(this._NORMALIZED_RADIUS / Math.fround(baseObj.radius));

    if (baseObj.radius < 30) {
      const smallCircleBonus = Math.min(30 - baseObj.radius, 5) / 50;

      scalingFactor *= 1 + smallCircleBonus;
    }

    const lastCursorPosition = this._getEndCursorPosition(lastObj);

    const scaledStackPos = baseObj.stackedStartPosition.scale(scalingFactor);
    const scaledCursorPos = lastCursorPosition.scale(scalingFactor);

    this.jumpDistance = scaledStackPos.subtract(scaledCursorPos).flength();

    if (lastObj instanceof Slider) {
      this._computeSliderCursorPosition(lastObj);

      this.travelDistance = lastObj.lazyTravelDistance;
      this.travelTime = Math.max(lastObj.lazyTravelTime / clockRate, this._MIN_DELTA_TIME);
      this.movementTime = Math.max(this.strainTime - this.travelTime, this._MIN_DELTA_TIME);

      /**
       * Jump distance from the slider tail to the next object, 
       * as opposed to the lazy position of JumpDistance.
       */
      const tailStackPos = lastObj.tail?.stackedStartPosition ?? lastObj.stackedStartPosition;
      const baseStackPos = baseObj.stackedStartPosition;

      const tailJumpDistance = tailStackPos.subtract(baseStackPos).flength() * scalingFactor;

      /**
       * For hitobjects which continue in the direction of the slider, 
       * the player will normally follow through the slider,
       * such that they're not jumping from the lazy position 
       * but rather from very close to (or the end of) the slider.
       * In such cases, a leniency is applied by also considering the jump distance 
       * from the tail of the slider, and taking the minimum jump distance.
       * Additional distance is removed based on position of jump relative to slider follow circle radius.
       * JumpDistance is the leniency distance beyond the assumed_slider_radius. 
       * tailJumpDistance is maximum_slider_radius since the full distance of radial leniency is still possible.
       */
      const movementDistance = Math.min(
        this.jumpDistance - (this._MAXIMUM_SLIDER_RADIUS - this._ASSUMED_SLIDER_RADIUS),
        tailJumpDistance - this._MAXIMUM_SLIDER_RADIUS,
      );

      this.movementDistance = Math.max(0, movementDistance);
    }
    else {
      this.movementTime = this.strainTime;
      this.movementDistance = this.jumpDistance;
    }

    if (this._lastLastObject !== null && !(this._lastLastObject instanceof Spinner)) {
      const lastLastCursorPosition = this._getEndCursorPosition(this._lastLastObject);

      const v1 = lastLastCursorPosition.subtract(lastObj.stackedStartPosition);
      const v2 = baseObj.stackedStartPosition.subtract(lastCursorPosition);

      const dot = v1.fdot(v2);
      const det = Math.fround(v1.x * v2.y) - Math.fround(v1.y * v2.x);

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
     * LazySliderDistance is coded to be sensitive to scaling, 
     * this makes the maths easier with the thresholds being used.
     */
    const scalingFactor = this._NORMALIZED_RADIUS / slider.radius;

    for (let i = 1; i < slider.nestedHitObjects.length; ++i) {
      const currMovementObj = slider.nestedHitObjects[i] as StandardHitObject;
      let currMovement = currMovementObj.stackedStartPosition.fsubtract(currCursorPosition);
      let currMovementLength = scalingFactor * currMovement.flength();

      /**
       * Amount of movement required so that the cursor position needs to be updated.
       */
      let requiredMovement = this._ASSUMED_SLIDER_RADIUS;

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
        requiredMovement = this._NORMALIZED_RADIUS;
      }

      if (currMovementLength > requiredMovement) {
        /**
         * This finds the positional delta from the required radius and the current position,
         * and updates the currCursorPosition accordingly, as well as rewarding distance.
         */
        const movementScale = (currMovementLength - requiredMovement) / currMovementLength;

        currCursorPosition = currCursorPosition.fadd(currMovement.fscale(movementScale));
        currMovementLength *= (currMovementLength - requiredMovement) / currMovementLength;
        slider.lazyTravelDistance += Math.fround(currMovementLength);
      }

      if (i === slider.nestedHitObjects.length - 1) {
        slider.lazyEndPosition = currCursorPosition;
      }
    }

    /**
     * Bonus for repeat sliders until a better per nested object strain system can be achieved.
     */
    slider.lazyTravelDistance *= Math.fround(Math.pow(1 + slider.repeats / 2.5, 1.0 / 2.5));
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
