import {
  ControlPointInfo,
  BeatmapDifficultySection,
  HitObject,
  IHasCombo,
  IHasX,
  HitType,
} from 'osu-resources';

export abstract class CatchHitObject extends HitObject implements IHasCombo, IHasX {
  static OBJECT_RADIUS = 64;

  timePreempt = 1000;

  scale = 0.5;

  offsetX = 0;

  private _originalX: number = this.startX;

  /**
   * Start x-position of the hit object.
   */
  get startX(): number {
    return (this.base as unknown as IHasX).startX;
  }

  set startX(value: number) {
    (this.base as unknown as IHasX).startX = value;
    this._originalX = value;
  }

  /**
   * Original start x-position of the hit object before any changes.
   */
  get originalX(): number {
    return this._originalX;
  }

  /**
   * Start x-position with applied offset.
   */
  get effectiveX(): number {
    return this._originalX + this.offsetX;
  }

  get randomSeed(): number {
    return Math.trunc(this.base.startTime);
  }

  applyDefaultsToSelf(
    controlPoints: ControlPointInfo,
    difficulty: BeatmapDifficultySection
  ): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    this.timePreempt =
      BeatmapDifficultySection.range(difficulty.approachRate, 1800, 1200, 450);

    /**
     * Closest approximation:
     * 23.0400009155273 + (7 - CS) * 4.47999954223635
     */
    this.scale =
      (1 - (Math.fround(0.7) * (difficulty.circleSize - 5)) / 5) / 2;
  }

  get isNewCombo(): boolean {
    return (this.hitType & HitType.NewCombo) > 0;
  }
}
