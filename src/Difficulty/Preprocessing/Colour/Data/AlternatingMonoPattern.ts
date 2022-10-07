import { TaikoDifficultyHitObject } from '../../TaikoDifficultyHitObject';
import { MonoStreak } from './MonoStreak';
import { RepeatingHitPatterns } from './RepeatingHitPatterns';

/**
 * Encodes a list of {@link MonoStreak}s. {@link MonoStreak}s with the same 
 * {@link MonoStreak.RunLength} are grouped together.
 */
export class AlternatingMonoPattern {
  /**
   * {@link MonoStreak}s that are grouped together within this {@link AlternatingMonoPattern}.
   */
  readonly monoStreaks: MonoStreak[] = [];

  /**
   * The parent {@link RepeatingHitPatterns} that contains this {@link AlternatingMonoPattern}
   */
  declare parent: RepeatingHitPatterns;

  /**
   * Index of this {@link AlternatingMonoPattern} within it's parent {@link RepeatingHitPatterns}
   */
  index = 0;

  /**
   * The first {@link TaikoDifficultyHitObject} in this {@link AlternatingMonoPattern}.
   */
  get firstHitObject(): TaikoDifficultyHitObject {
    return this.monoStreaks[0].firstHitObject;
  }

  /**
   * Determine if this {@link AlternatingMonoPattern} is a repetition 
   * of another {@link AlternatingMonoPattern}. This is a strict comparison 
   * and is true if and only if the colour sequence is exactly the same.
   */
  isRepetitionOf(other: AlternatingMonoPattern): boolean {
    return this.hasIdenticalMonoLength(other) &&
      other.monoStreaks.length === this.monoStreaks.length &&
      other.monoStreaks[0].isRim === this.monoStreaks[0].isRim;
  }

  /**
   * Determine if this {@link AlternatingMonoPattern} has the same 
   * mono length of another {@link AlternatingMonoPattern}.
   */
  hasIdenticalMonoLength(other: AlternatingMonoPattern): boolean {
    return other.monoStreaks[0].runLength === this.monoStreaks[0].runLength;
  }
}
