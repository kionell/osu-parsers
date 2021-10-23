import {
  ControlPointInfo,
  BeatmapDifficultySection,
  Vector2,
  HitObject,
  IHasPosition,
  IHasCombo,
  HitType,
} from 'osu-resources';

export abstract class StandardHitObject extends HitObject implements IHasPosition, IHasCombo {
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

  private _stackHeight = 0;

  private _scale = 0.5;

  private _stackOffset = new Vector2(0, 0);

  get startX(): number {
    return (this.base as unknown as IHasPosition).startX;
  }

  set startX(value: number) {
    (this.base as unknown as IHasPosition).startX = value;
  }

  get startY(): number {
    return (this.base as unknown as IHasPosition).startY;
  }

  set startY(value: number) {
    (this.base as unknown as IHasPosition).startY = value;
  }

  get startPosition(): Vector2 {
    return (this.base as unknown as IHasPosition).startPosition;
  }

  set startPosition(value: Vector2) {
    (this.base as unknown as IHasPosition).startPosition = value;
  }

  get endPosition(): Vector2 {
    return (this.base as unknown as IHasPosition).endPosition;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;

    this._stackOffset.x = Math.fround(-6.4) * value * this._stackHeight;
    this._stackOffset.y = Math.fround(-6.4) * value * this._stackHeight;
  }

  get radius(): number {
    return StandardHitObject.OBJECT_RADIUS * this._scale;
  }

  get stackHeight(): number {
    return this._stackHeight;
  }

  set stackHeight(value: number) {
    this._stackHeight = value;

    this._stackOffset.x = Math.fround(-6.4) * this._scale * value;
    this._stackOffset.y = Math.fround(-6.4) * this._scale * value;
  }

  get stackedOffset(): Vector2 {
    return this._stackOffset;
  }

  set stackedOffset(value: Vector2) {
    this._stackOffset = value;
  }

  get stackedStartPosition(): Vector2 {
    return this.startPosition.add(this.stackedOffset);
  }

  get stackedEndPosition(): Vector2 {
    return this.endPosition.add(this.stackedOffset);
  }

  get isNewCombo(): boolean {
    return (this.hitType & HitType.NewCombo) > 0;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    this.timePreempt = BeatmapDifficultySection.range(difficulty.approachRate, 1800, 1200, 450);

    this.timeFadeIn = 400 * Math.min(1, this.timePreempt / StandardHitObject.PREEMPT_MIN);

    /**
     * Closest approximation:
     * 23.0400009155273 + (7 - CS) * 4.47999954223635
     */
    this.scale = (1 - (Math.fround(0.7) * (difficulty.circleSize - 5)) / 5) / 2;
  }
}
