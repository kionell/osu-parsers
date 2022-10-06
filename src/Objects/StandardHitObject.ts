import {
  ControlPointInfo,
  BeatmapDifficultySection,
  Vector2,
  HitObject,
  IHasPosition,
  IHasComboInformation,
  HitWindows,
} from 'osu-classes';

import { StandardHitWindows } from '../Scoring';

export abstract class StandardHitObject extends HitObject implements IHasPosition, IHasComboInformation {
  /**
   * The radius of hit objects (ie. the radius of a Circle).
   */
  static OBJECT_RADIUS = 64;

  /**
   * Scoring distance with a speed-adjusted beat length of 1 second
   * (ie. the speed slider balls move through their track).
   */
  static BASE_SCORING_DISTANCE = 100;

  /**
   * Minimum preempt time at AR=10.
   */
  static PREEMPT_MIN = 450;

  timePreempt = 600;
  timeFadeIn = 400;

  private _scale = 0.5;
  private _stackHeight = 0;
  private _stackOffset = new Vector2(0, 0);

  currentComboIndex = 0;
  comboIndex = 0;
  comboIndexWithOffsets = 0;
  comboOffset = 0;
  lastInCombo = false;
  isNewCombo = false;

  hitWindows: HitWindows = new StandardHitWindows();

  get endPosition(): Vector2 {
    return this.startPosition;
  }

  get endX(): number {
    return this.endPosition.x;
  }

  set endX(value: number) {
    this.endPosition.x = value;
  }

  get endY(): number {
    return this.endPosition.y;
  }

  set endY(value: number) {
    this.endPosition.y = value;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;

    this._stackOffset.x = Math.fround(
      Math.fround(Math.fround(-6.4) * Math.fround(value)) * this._stackHeight,
    );

    this._stackOffset.y = Math.fround(
      Math.fround(Math.fround(-6.4) * Math.fround(value)) * this._stackHeight,
    );
  }

  get radius(): number {
    return StandardHitObject.OBJECT_RADIUS * this._scale;
  }

  get stackHeight(): number {
    return this._stackHeight;
  }

  set stackHeight(value: number) {
    this._stackHeight = value;

    this._stackOffset.x = Math.fround(
      Math.fround(-6.4) * Math.fround(this._scale) * value,
    );

    this._stackOffset.y = Math.fround(
      Math.fround(-6.4) * Math.fround(this._scale) * value,
    );

    this.nestedHitObjects.forEach((n) => {
      (n as StandardHitObject).stackHeight = this._stackHeight;
    });
  }

  get stackedOffset(): Vector2 {
    return this._stackOffset;
  }

  set stackedOffset(value: Vector2) {
    this._stackOffset = value;
  }

  get stackedStartPosition(): Vector2 {
    return this.startPosition.fadd(this.stackedOffset);
  }

  get stackedEndPosition(): Vector2 {
    return this.endPosition.fadd(this.stackedOffset);
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    this.timePreempt = BeatmapDifficultySection.range(difficulty.approachRate, 1800, 1200, 450);

    this.timeFadeIn = 400 * Math.min(1, this.timePreempt / StandardHitObject.PREEMPT_MIN);

    /**
     * Closest approximation:
     * 23.0400009155273 + (7 - CS) * 4.47999954223635
     */
    this.scale = Math.fround((1 - Math.fround(0.7) * (difficulty.circleSize - 5) / 5) / 2);
  }

  /**
   * Creates a deep copy of this standard hit object.
   * @returns Cloned standard hit object.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.stackHeight = this.stackHeight;
    cloned.scale = this.scale;
    cloned.currentComboIndex = this.currentComboIndex;
    cloned.comboIndex = this.comboIndex;
    cloned.comboIndexWithOffsets = this.comboIndexWithOffsets;
    cloned.comboOffset = this.comboOffset;
    cloned.lastInCombo = this.lastInCombo;

    return cloned;
  }
}
