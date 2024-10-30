import {
  ControlPointInfo,
  BeatmapDifficultySection,
  HitObject,
  IHasComboInformation,
  IHasX,
} from 'osu-classes';

/**
 * An osu!catch hit object.
 */
export abstract class CatchHitObject extends HitObject implements IHasComboInformation, IHasX {
  /**
   * The radius of hit objects.
   */
  static OBJECT_RADIUS = 64;

  currentComboIndex = 0;
  comboIndex = 0;
  comboIndexWithOffsets = 0;
  comboOffset = 0;
  lastInCombo = false;
  isNewCombo = false;

  timePreempt = 1000;

  scale = 0.5;

  /**
   * X-offset of the hit object.
   */
  offsetX = 0;

  private _originalX: number = this.startX;

  /**
   * The starting X-position of the hit object.
   */
  get startX(): number {
    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
    this._originalX = value;
  }

  /**
   * The ending X-position of the hit object.
   */
  get endX(): number {
    return this.effectiveX;
  }

  /**
   * Original start X-position of the hit object before any changes.
   */
  get originalX(): number {
    return Math.fround(this._originalX);
  }

  /**
   * Start X-position with applied offset.
   */
  get effectiveX(): number {
    return Math.fround(this._originalX + this.offsetX);
  }

  get randomSeed(): number {
    return Math.trunc(this.startTime);
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    this.timePreempt = Math.fround(
      BeatmapDifficultySection.range(difficulty.approachRate, 1800, 1200, 450),
    );

    /**
     * Closest approximation:
     * 23.0400009155273 + (7 - CS) * 4.47999954223635
     */
    const scale = Math.fround(Math.fround(0.7) * Math.fround(difficulty.circleSize - 5));

    this.scale = Math.fround(Math.fround(1 - Math.fround(scale / 5)) / 2);
  }

  clone(): this {
    const cloned = super.clone();

    cloned.timePreempt = this.timePreempt;
    cloned.scale = this.scale;
    cloned.offsetX = this.offsetX;
    cloned.currentComboIndex = this.currentComboIndex;
    cloned.comboIndex = this.comboIndex;
    cloned.comboIndexWithOffsets = this.comboIndexWithOffsets;
    cloned.comboOffset = this.comboOffset;
    cloned.lastInCombo = this.lastInCombo;

    return cloned;
  }
}
