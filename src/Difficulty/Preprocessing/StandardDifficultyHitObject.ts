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
   * Angle the player has to take to hit this difficulty hit object.
   * Calculated as the angle between the circles (current-2, current-1, current).
   */
  angle: number | null = null;

  /**
   * Normalised distance from the "lazy" end position of the previous 
   * difficulty hit object to the start position of this difficulty hit object.
   * 
   * The "lazy" end position is the position at which the cursor ends up 
   * if the previous hitobject is followed with as minimal movement as possible 
   * (i.e. on the edge of slider follow circles).
   */
  lazyJumpDistance = 0;

  /**
   * Normalised shortest distance to consider for a jump between 
   * the previous and this difficulty hit objects.
   * This is bounded from above by lazy jump distance, and is smaller than the former 
   * if a more natural path is able to be taken through the previous difficulty hit object.
   */
  minimumJumpDistance = 0;

  /**
   * The time taken to travel through minimum jump distance, 
   * with a minimum value of 25ms.
   */
  minimumJumpTime = 0;

  /**
   * Normalised distance between the start and end position 
   * of this difficulty hit object.
   */
  travelDistance = 0;

  /**
   * The time taken to travel through travel distance, 
   * with a minimum value of 25ms for a non-zero distance.
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

    if (baseObj instanceof Slider) {
      this._computeSliderCursorPosition(baseObj);

      this.travelDistance = baseObj.lazyTravelDistance;
      this.travelTime = Math.max(baseObj.lazyTravelTime / clockRate, this._MIN_DELTA_TIME);
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
    let scalingFactor = Math.fround(this._NORMALIZED_RADIUS / Math.fround(baseObj.radius));

    if (baseObj.radius < 30) {
      const smallCircleBonus = Math.min(30 - baseObj.radius, 5) / 50;

      scalingFactor *= 1 + smallCircleBonus;
    }

    const lastCursorPosition = this._getEndCursorPosition(lastObj);

    const scaledStackPos = baseObj.stackedStartPosition.scale(scalingFactor);
    const scaledCursorPos = lastCursorPosition.scale(scalingFactor);

    this.lazyJumpDistance = scaledStackPos.subtract(scaledCursorPos).flength();
    this.minimumJumpDistance = this.lazyJumpDistance;
    this.minimumJumpTime = this.strainTime;

    if (lastObj instanceof Slider) {
      const lastTravelTime = Math.max(lastObj.lazyTravelTime / clockRate, this._MIN_DELTA_TIME);

      this.minimumJumpTime = Math.max(this.strainTime - lastTravelTime, this._MIN_DELTA_TIME);

      /**
       * There are two types of slider-to-object patterns to consider in order to better approximate the real movement a player will take to jump between the hitobjects.
       * 
       * 1. The anti-flow pattern, where players cut the slider short in order to move to the next hitobject.
       * 
       *      <======o==>  ← slider
       *             |     ← most natural jump path
       *             o     ← a follow-up hitcircle
       * 
       * In this case the most natural jump path is approximated by LazyJumpDistance.
       * 
       * 2. The flow pattern, where players follow through the slider to its visual extent into the next hitobject.
       * 
       *      <======o==>---o
       *                  ↑
       *        most natural jump path
       * 
       * In this case the most natural jump path is better approximated by a new distance called "tailJumpDistance" - the distance between the slider's tail and the next hitobject.
       * 
       * Thus, the player is assumed to jump the minimum of these two distances in all cases.
       */

      const tailStackPos = lastObj.tail?.stackedStartPosition ?? lastObj.stackedStartPosition;
      const baseStackPos = baseObj.stackedStartPosition;

      const tailJumpDistance = tailStackPos.subtract(baseStackPos).flength() * scalingFactor;

      const minimumJumpDistance = Math.min(
        this.lazyJumpDistance - (this._MAXIMUM_SLIDER_RADIUS - this._ASSUMED_SLIDER_RADIUS),
        tailJumpDistance - this._MAXIMUM_SLIDER_RADIUS,
      );

      this.minimumJumpDistance = Math.max(0, minimumJumpDistance);
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
