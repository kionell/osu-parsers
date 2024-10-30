import { DifficultyRange } from './DifficultyRange';
import { HitResult } from './Enums/HitResult';

/**
 * A structure containing timing data for hit window based gameplay.
 */
export class HitWindows {
  private static readonly _BASE_RANGES: DifficultyRange[] = [
    new DifficultyRange(HitResult.Perfect, 22.4, 19.4, 13.9),
    new DifficultyRange(HitResult.Great, 64, 49, 34),
    new DifficultyRange(HitResult.Good, 97, 82, 67),
    new DifficultyRange(HitResult.Ok, 127, 112, 97),
    new DifficultyRange(HitResult.Meh, 151, 136, 121),
    new DifficultyRange(HitResult.Miss, 188, 173, 158),
  ];

  private _perfect = 0;
  private _great = 0;
  private _good = 0;
  private _ok = 0;
  private _meh = 0;
  private _miss = 0;

  /**
   * Retrieves the hit result with the largest hit window that produces a successful hit.
   * @returns The lowest allowed successful hit result.
   */
  protected _lowestSuccessfulHitResult(): HitResult {
    for (let result = HitResult.Meh; result <= HitResult.Perfect; ++result) {
      if (this.isHitResultAllowed(result)) {
        return result;
      }
    }

    return HitResult.None;
  }

  /**
   * Retrieves a mapping of hit results to their timing windows for all allowed hit results.
   */
  *getAllAvailableWindows(): Generator<[HitResult, number]> {
    for (let result = HitResult.Meh; result <= HitResult.Perfect; ++result) {
      if (this.isHitResultAllowed(result)) {
        yield [result, this.windowFor(result)];
      }
    }
  }

  /**
   * Check whether it is possible to achieve the provided hit result.
   * @param result The result type to check.
   * @returns Whether the hit result can be achieved.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isHitResultAllowed(result: HitResult): boolean {
    return true;
  }

  /**
   * Sets hit windows with values that correspond to a difficulty parameter.
   * @param difficulty The parameter.
   */
  setDifficulty(difficulty: number): void {
    for (const range of this._getRanges()) {
      const value = DifficultyRange.map(difficulty, range.min, range.average, range.max);

      switch (range.result) {
        case HitResult.Miss:
          this._miss = value;
          break;

        case HitResult.Meh:
          this._meh = value;
          break;

        case HitResult.Ok:
          this._ok = value;
          break;

        case HitResult.Good:
          this._good = value;
          break;

        case HitResult.Great:
          this._great = value;
          break;

        case HitResult.Perfect:
          this._perfect = value;
          break;
      }
    }
  }

  /**
   * Retrieves the hit result for a time offset.
   * @param timeOffset The time offset.
   * @returns The hit result, or HitResult.None if timeOffset doesn't result in a judgement.
   */
  resultFor(timeOffset: number): HitResult {
    timeOffset = Math.abs(timeOffset);

    for (let result = HitResult.Perfect; result >= HitResult.Miss; --result) {
      if (this.isHitResultAllowed(result) && timeOffset <= this.windowFor(result)) {
        return result;
      }
    }

    return HitResult.None;
  }

  /**
   * Retrieves the hit window for a hit result.
   * This is the number of +/- milliseconds allowed for the requested result 
   * (so the actual hittable range is double this).
   * @param result The expected hit result.
   * @returns One half of the hit window for result.
   */
  windowFor(result: HitResult): number {
    switch (result) {
      case HitResult.Perfect:
        return this._perfect;

      case HitResult.Great:
        return this._great;

      case HitResult.Good:
        return this._good;

      case HitResult.Ok:
        return this._ok;

      case HitResult.Meh:
        return this._meh;

      case HitResult.Miss:
        return this._miss;

      default:
        throw new Error('Unknown enum member');
    }
  }

  /**
   * Given a time offset, whether the hit object can ever be hit in the future with a non-miss result.
   * This happens if time offset is less than what is required for lowest successful hit result.
   * @param timeOffset The time offset.
   * @returns Whether the hit object can be hit at any point in the future from this time offset.
   */
  canBeHit(timeOffset: number): boolean {
    return timeOffset <= this.windowFor(this._lowestSuccessfulHitResult());
  }

  /**
   * Retrieve a valid list of <see cref="DifficultyRange"/>s representing hit windows.
   * Defaults are provided but can be overridden to customise for a ruleset.
   */
  protected _getRanges(): DifficultyRange[] {
    return HitWindows._BASE_RANGES;
  }

  private static EmptyHitWindows = class EmptyHitWindows extends HitWindows {
    private static readonly _ranges: DifficultyRange[] = [
      new DifficultyRange(HitResult.Perfect, 0, 0, 0),
      new DifficultyRange(HitResult.Miss, 0, 0, 0),
    ];

    isHitResultAllowed(result: HitResult): boolean {
      switch (result) {
        case HitResult.Perfect:
        case HitResult.Miss:
          return true;
      }

      return false;
    }

    protected _getRanges(): DifficultyRange[] {
      return EmptyHitWindows._ranges;
    }
  };

  /**
   * An empty hit windows with only misses and perfects.
   * No time values are provided (meaning instantaneous hit or miss).
   */
  static empty: HitWindows = new HitWindows.EmptyHitWindows();
}
