import { DifficultyHitObject, LimitedCapacityQueue, StrainDecaySkill } from 'osu-classes';
import { TaikoDifficultyHitObject } from '../Preprocessing/TaikoDifficultyHitObject';
import { Hit } from '../../Objects';

/**
 * Calculates the rhythm coefficient of taiko difficulty.
 */
export class Rhythm extends StrainDecaySkill {
  /**
   * The note-based decay for rhythm strain.
   * StrainDecayBase is not used here, as it's time- and not note-based.
   */
  private static _STRAIN_DECAY = 0.96;

  /**
   * Maximum number of entries in rhythmHistory.
   */
  private static _RHYTHM_HISTORY_MAX_LENGTH = 8;

  /**
   * Contains the last RHYTHM_HISTORY_MAX_LENGTH changes in note sequence rhythms.
   */
  private readonly _rhythmHistory = new LimitedCapacityQueue<TaikoDifficultyHitObject>(Rhythm._RHYTHM_HISTORY_MAX_LENGTH);

  /**
   * Contains the rolling rhythm strain.
   * Used to apply per-note decay.
   */
  private _currentRhythmStrain = 0;

  protected _skillMultiplier = 10;
  protected _strainDecayBase = 0;

  /**
   * Number of notes since the last rhythm change has taken place.
   */
  private _notesSinceRhythmChange = 0;

  protected _strainValueOf(current: DifficultyHitObject): number {
    /**
     * Drum rolls and swells are exempt.
     */
    if (!(current.baseObject instanceof Hit)) {
      this._resetRhythmAndStrain();

      return 0;
    }

    this._currentRhythmStrain *= Rhythm._STRAIN_DECAY;

    const hitObject = current as TaikoDifficultyHitObject;

    this._notesSinceRhythmChange += 1;

    /**
     * Rhythm difficulty zero (due to rhythm not changing) => no rhythm strain.
     */
    if (hitObject.rhythm.difficulty === 0) {
      return 0;
    }

    let objectStrain = hitObject.rhythm.difficulty;

    objectStrain *= this._repetitionPenalties(hitObject);
    objectStrain *= Rhythm._patternLengthPenalty(this._notesSinceRhythmChange);
    objectStrain *= this._speedPenalty(hitObject.deltaTime);

    /**
     * Careful - needs to be done here since calls above read this value.
     */
    this._notesSinceRhythmChange = 0;
    this._currentRhythmStrain += objectStrain;

    return this._currentRhythmStrain;
  }

  /**
   * Returns a penalty to apply to the current hit object caused by repeating rhythm changes.
   * Repetitions of more recent patterns are associated with a higher penalty.
   * @param hitObject The current hit object being considered.
   */
  private _repetitionPenalties(hitObject: TaikoDifficultyHitObject): number {
    let penalty = 1;

    this._rhythmHistory.enqueue(hitObject);

    const halfMaxLength = Rhythm._RHYTHM_HISTORY_MAX_LENGTH / 2;

    for (let i = 2; i <= halfMaxLength; ++i) {
      const startIndex = this._rhythmHistory.count - i - 1;

      for (let start = startIndex; start >= 0; --start) {
        if (!this._samePattern(start, i)) continue;

        const notesSince = hitObject.objectIndex - this._rhythmHistory.get(start).objectIndex;

        penalty *= Rhythm._repetitionPenalty(notesSince);

        break;
      }
    }

    return penalty;
  }

  /**
   * Determines whether the rhythm change pattern starting at start 
   * is a repeat of any of the mostRecentPatternsToCompare.
   */
  private _samePattern(start: number, mostRecentPatternsToCompare: number): boolean {
    for (let i = 0; i < mostRecentPatternsToCompare; ++i) {
      const index = this._rhythmHistory.count - mostRecentPatternsToCompare + i;

      if (this._rhythmHistory.get(start + i).rhythm !== this._rhythmHistory.get(index).rhythm) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculates a single rhythm repetition penalty.
   * @param notesSince Number of notes since the last repetition of a rhythm change.
   */
  private static _repetitionPenalty(notesSince: number) {
    return Math.min(1.0, 0.032 * notesSince);
  }

  /**
   * Calculates a penalty based on the number of notes since the last rhythm change.
   * Both rare and frequent rhythm changes are penalised.
   * @param patternLength Number of notes since the last rhythm change.
   */
  private static _patternLengthPenalty(patternLength: number) {
    const shortPatternPenalty = Math.min(0.15 * patternLength, 1.0);
    const longPatternPenalty = Math.min(Math.max(0.0, 2.5 - 0.15 * patternLength), 1.0);

    return Math.min(shortPatternPenalty, longPatternPenalty);
  }

  /**
   * Calculates a penalty for objects that do not require alternating hands.
   * @param deltaTime Time (in milliseconds) since the last hit object.
   */
  private _speedPenalty(deltaTime: number): number {
    if (deltaTime < 80) return 1;
    if (deltaTime < 210) return Math.max(0, 1.4 - 0.005 * deltaTime);

    this._resetRhythmAndStrain();

    return 0;
  }

  /**
   * Resets the rolling strain value and notesSinceRhythmChange counter.
   */
  private _resetRhythmAndStrain(): void {
    this._currentRhythmStrain = 0.0;
    this._notesSinceRhythmChange = 0;
  }
}
