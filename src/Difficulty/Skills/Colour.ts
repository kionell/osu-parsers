import { DifficultyHitObject, LimitedCapacityQueue, StrainDecaySkill } from 'osu-classes';
import { TaikoDifficultyHitObject } from '../Preprocessing/TaikoDifficultyHitObject';
import { Hit } from '../../Objects';

/**
 * Calculates the colour coefficient of taiko difficulty.
 */
export class Colour extends StrainDecaySkill {
  protected _skillMultiplier = 1;
  protected _strainDecayBase = 0.4;

  /**
   * Maximum number of entries to keep in monoHistory.
   */
  private static MONO_HISTORY_MAX_LENGTH = 5;

  /**
   * Queue with the lengths of the last MONO_HISTORY_MAX_LENGTH most recent 
   * mono (single-colour) patterns, with the most recent value at the end of the queue.
   */
  private readonly _monoHistory = new LimitedCapacityQueue<number>(Colour.MONO_HISTORY_MAX_LENGTH);

  /**
   * Whether the last object is rim or not.
   */
  private _previousIsRim?: boolean;

  /**
   * Length of the current mono pattern.
   */
  private _currentMonoLength = 0;

  protected _strainValueOf(current: DifficultyHitObject): number {
    /**
     * changing from/to a drum roll or a swell does not constitute a colour change.
     * hits spaced more than a second apart are also exempt from colour strain.
     */
    const isLastHit = current.lastObject instanceof Hit;
    const isBaseHit = current.baseObject instanceof Hit;

    if (!(isLastHit && isBaseHit && current.deltaTime < 1000)) {
      this._monoHistory.clear();

      const currentHit = current.baseObject as Hit;

      this._currentMonoLength = currentHit ? 1 : 0;
      this._previousIsRim = currentHit?.isRim;

      return 0;
    }

    const taikoCurrent = current as TaikoDifficultyHitObject;

    let objectStrain = 0;

    if (this._previousIsRim !== undefined && taikoCurrent.isRim !== this._previousIsRim) {
      /**
       * The colour has changed.
       */
      objectStrain = 1;

      if (this._monoHistory.count < 2) {
        /**
         * There needs to be at least two streaks to determine a strain.
         */
        objectStrain = 0;
      }
      else if ((this._monoHistory.get(this._monoHistory.count - 1) + this._currentMonoLength) % 2 === 0) {
        /**
         * The last streak in the history is guaranteed to be a different type to the current streak.
         * If the total number of notes in the two streaks is even, nullify this object's strain.
         */
        objectStrain = 0;
      }

      objectStrain *= this._repetitionPenalties();

      this._currentMonoLength = 1;
    }
    else {
      this._currentMonoLength += 1;
    }

    this._previousIsRim = taikoCurrent.isRim;

    return objectStrain;
  }

  /**
   * The penalty to apply due to the length of repetition in colour streaks.
   */
  private _repetitionPenalties(): number {
    const MOST_RECENT_PATTERNS_TO_COMPARE = 2;

    let penalty = 1;

    this._monoHistory.enqueue(this._currentMonoLength);

    const startIndex = this._monoHistory.count - MOST_RECENT_PATTERNS_TO_COMPARE - 1;

    for (let start = startIndex; start >= 0; start--) {
      if (!this._isSamePattern(start, MOST_RECENT_PATTERNS_TO_COMPARE)) {
        continue;
      }

      let notesSince = 0;

      for (let i = start; i < this._monoHistory.count; ++i) {
        notesSince += this._monoHistory.get(i);
      }

      penalty *= this._repetitionPenalty(notesSince);

      break;
    }

    return penalty;
  }

  /**
   * Determines whether the last <paramref name="mostRecentPatternsToCompare patterns have repeated in the history
   * of single-colour note sequences, starting from <paramref name="start.
   */
  private _isSamePattern(start: number, mostRecentPatternsToCompare: number): boolean {
    for (let i = 0; i < mostRecentPatternsToCompare; ++i) {
      const index = this._monoHistory.count - mostRecentPatternsToCompare + i;

      if (this._monoHistory.get(start + i) !== this._monoHistory.get(index)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculates the strain penalty for a colour pattern repetition.
   * @param notesSince The number of notes since the last repetition of the pattern.
   */
  private _repetitionPenalty(notesSince: number): number {
    return Math.min(1.0, 0.032 * notesSince);
  }
}
