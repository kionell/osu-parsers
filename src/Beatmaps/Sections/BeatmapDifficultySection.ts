export class BeatmapDifficultySection {
  /**
   * The default value used for all difficulty settings 
   * except slider multiplier and slider tickrate.
   */
  static BASE_DIFFICULTY = 5;

  protected _CS: number = BeatmapDifficultySection.BASE_DIFFICULTY;

  protected _HP: number = BeatmapDifficultySection.BASE_DIFFICULTY;

  protected _OD: number = BeatmapDifficultySection.BASE_DIFFICULTY;

  protected _AR?: number;

  protected _multiplier = 1;

  protected _tickRate = 1;

  protected _rate = 1;

  /**
   * The circle size of this beatmap.
   */
  get circleSize(): number {
    return Math.fround(this._CS);
  }

  set circleSize(value: number) {
    this._CS = Math.max(0, Math.min(value, 10));
  }

  /**
   * The HP drain rate of this beatmap.
   */
  get drainRate(): number {
    return Math.fround(this._HP);
  }

  set drainRate(value: number) {
    this._HP = Math.max(0, Math.min(value, 10));
  }

  /**
   * The overall difficulty of this beatmap.
   */
  get overallDifficulty(): number {
    return Math.fround(this._OD);
  }

  set overallDifficulty(value: number) {
    this._OD = Math.max(0, Math.min(value, this._rate >= 1.5 ? 11 : 10));
  }

  /**
   * The approach rate of this beatmap.
   */
  get approachRate(): number {
    return Math.fround(this._AR || this._OD);
  }

  set approachRate(value: number) {
    this._AR = Math.max(0, Math.min(value, this._rate >= 1.5 ? 11 : 10));
  }

  /**
   * The slider multiplier of this beatmap.
   */
  get sliderMultiplier(): number {
    return this._multiplier;
  }

  set sliderMultiplier(value: number) {
    this._multiplier = value;
  }

  /**
   * The slider tickrate of this beatmap.
   */
  get sliderTickRate(): number {
    return this._tickRate;
  }

  set sliderTickRate(value: number) {
    this._tickRate = value;
  }

  /**
   * The current state of this beatmap's clock rate.
   */
  get clockRate(): number {
    return this._rate;
  }

  set clockRate(value: number) {
    this._rate = value;
  }

  /**
   * Creates a copy of this beatmap difficulty section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapDifficultySection {
    const cloned = new BeatmapDifficultySection();

    cloned.circleSize = this._CS;
    cloned.drainRate = this._HP;
    cloned.overallDifficulty = this._OD;

    if (this._AR) {
      cloned.approachRate = this._AR;
    }

    cloned.sliderMultiplier = this._multiplier;
    cloned.sliderTickRate = this._tickRate;
    cloned.clockRate = this._rate;

    return cloned;
  }

  /**
   * Maps a difficulty value [0, 10] to a two-piece linear range of values.
   * @param diff The difficulty value to be mapped.
   * @param min Minimum of the resulting range which will be achieved by a difficulty value of 0.
   * @param mid Midpoint of the resulting range which will be achieved by a difficulty value of 5.
   * @param max Maximum of the resulting range which will be achieved by a difficulty value of 10.
   * @returns Value to which the difficulty value maps in the specified range.
   */
  static range(diff: number, min: number, mid: number, max: number): number {
    if (diff > 5) {
      return mid + ((max - mid) * (diff - 5)) / 5;
    }

    if (diff < 5) {
      return mid - ((mid - min) * (5 - diff)) / 5;
    }

    return mid;
  }
}
