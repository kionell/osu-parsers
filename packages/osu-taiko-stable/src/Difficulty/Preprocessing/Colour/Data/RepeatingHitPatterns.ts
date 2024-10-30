import { TaikoDifficultyHitObject } from '../../TaikoDifficultyHitObject';
import { AlternatingMonoPattern } from './AlternatingMonoPattern';

/**
 * Encodes a list of {@link AlternatingMonoPattern}s, grouped together 
 * by back and forth repetition of the same * {@link AlternatingMonoPattern}. 
 * Also stores the repetition interval between this and the previous {@link RepeatingHitPatterns}.
 */
export class RepeatingHitPatterns {
  /**
   * Maximum amount of {@link RepeatingHitPatterns}s to look back to find a repetition.
   */
  private static MAX_REPETITION_INTERVAL = 16;

  /**
   * The {@link AlternatingMonoPattern}s that are grouped together within this {@link RepeatingHitPatterns}.
   */
  readonly alternatingMonoPatterns: AlternatingMonoPattern[] = [];

  /**
   * The parent {@link TaikoDifficultyHitObject} in this {@link RepeatingHitPatterns}
   */
  get firstHitObject(): TaikoDifficultyHitObject {
    return this.alternatingMonoPatterns[0].firstHitObject;
  }

  /**
   * The previous {@link RepeatingHitPatterns}. This is used to determine the repetition interval.
   */
  readonly previous: RepeatingHitPatterns | null = null;

  private _repetitionInterval = RepeatingHitPatterns.MAX_REPETITION_INTERVAL + 1;

  /**
   * How many {@link RepeatingHitPatterns} between 
   * the current and previous identical {@link RepeatingHitPatterns}.
   * If no repetition is found this will have a value of {@link MAX_REPETITION_INTERVAL} + 1.
   */
  get repetitionInterval(): number {
    return this._repetitionInterval;
  }

  private set repetitionInterval(value: number) {
    this._repetitionInterval = value;
  }

  constructor(previous: RepeatingHitPatterns | null) {
    this.previous = previous;
  }

  /**
   * Returns true if other is considered a repetition of this pattern. 
   * This is true if other's first two payloads have identical mono lengths.
   */
  private _isRepetitionOf(other: RepeatingHitPatterns): boolean {
    if (this.alternatingMonoPatterns.length !== other.alternatingMonoPatterns.length) {
      return false;
    }

    const length = Math.min(this.alternatingMonoPatterns.length, 2);

    for (let i = 0; i < length; ++i) {
      if (!this.alternatingMonoPatterns[i].hasIdenticalMonoLength(other.alternatingMonoPatterns[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Finds the closest previous {@link RepeatingHitPatterns} 
   * that has the identical {@link AlternatingMonoPatterns}.
   * Interval is defined as the amount of {@link RepeatingHitPatterns} 
   * chunks between the current and repeated patterns.
   */
  findRepetitionInterval(): void {
    const MAX_REPETITION_INTERVAL = RepeatingHitPatterns.MAX_REPETITION_INTERVAL;

    if (this.previous === null) {
      this.repetitionInterval = MAX_REPETITION_INTERVAL + 1;

      return;
    }

    let other: RepeatingHitPatterns | null = this.previous;
    let interval = 1;

    while (interval < MAX_REPETITION_INTERVAL) {
      if (this._isRepetitionOf(other)) {
        this.repetitionInterval = Math.min(interval, MAX_REPETITION_INTERVAL);

        return;
      }

      other = other.previous;

      if (other === null) break;

      ++interval;
    }

    this.repetitionInterval = MAX_REPETITION_INTERVAL + 1;
  }
}
