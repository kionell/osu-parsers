import { DifficultyHitObject, LimitedCapacityQueue, MathUtils, StrainDecaySkill } from 'osu-classes';
import { Hit } from '../../Objects';
import { TaikoDifficultyHitObject } from '../Preprocessing';

/**
 * Calculates the rhythm coefficient of taiko difficulty.
 */
export class Rhythm extends StrainDecaySkill {
  protected _skillMultiplier = 10;
  protected _strainDecayBase = 0;

  /**
   * The note-based decay for rhythm strain.
   * {@link strainDecayBase} is not used here, as it's time- and not note-based.
   */
  private static STRAIN_DECAY = 0.96;

  /**
   * Maximum number of entries in {@link rhythmHistory}.
   */
  private static RHYTHM_HISTORY_MAX_LENGTH = 8;

  /**
   * Contains the last {@link RHYTHM_HISTORY_MAX_LENGTH} changes in note sequence rhythms.
   */
  private readonly _rhythmHistory = new LimitedCapacityQueue<TaikoDifficultyHitObject>(
    Rhythm.RHYTHM_HISTORY_MAX_LENGTH,
  );

  /**
   * Contains the rolling rhythm strain. Used to apply per-note decay.
   */
  private _currentRhythmStrain = 0;

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

    this._currentRhythmStrain *= Rhythm.STRAIN_DECAY;

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

    for (
      let mostRecentPatternsToCompare = 2;
      mostRecentPatternsToCompare <= Rhythm.RHYTHM_HISTORY_MAX_LENGTH / 2;
      mostRecentPatternsToCompare++
    ) {
      const startIndex = this._rhythmHistory.count - mostRecentPatternsToCompare - 1;

      for (let start = startIndex; start >= 0; start--) {
        if (!this._samePattern(start, mostRecentPatternsToCompare)) {
          continue;
        }

        const notesSince = hitObject.index - this._rhythmHistory.get(start).index;

        penalty *= Rhythm._repetitionPenalty(notesSince);

        break;
      }
    }

    return penalty;
  }

  /**
   * Determines whether the rhythm change pattern starting at 
   * {@link start} is a repeat of any of the {@link mostRecentPatternsToCompare}.
   */
  private _samePattern(start: number, mostRecentPatternsToCompare: number): boolean {
    for (let i = 0; i < mostRecentPatternsToCompare; i++) {
      const firstRhythm = this._rhythmHistory.get(start + i).rhythm;
      const secondRhythm = this._rhythmHistory.get(
        this._rhythmHistory.count - mostRecentPatternsToCompare + i,
      ).rhythm;

      if (firstRhythm !== secondRhythm) return false;
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
  private static _patternLengthPenalty(patternLength: number): number {
    const shortPatternPenalty = Math.min(0.15 * patternLength, 1.0);
    const longPatternPenalty = MathUtils.clamp01(2.5 - 0.15 * patternLength);

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
   * Resets the rolling strain value and {@link notesSinceRhythmChange} counter.
   */
  private _resetRhythmAndStrain(): void {
    this._currentRhythmStrain = 0.0;
    this._notesSinceRhythmChange = 0;
  }
}
