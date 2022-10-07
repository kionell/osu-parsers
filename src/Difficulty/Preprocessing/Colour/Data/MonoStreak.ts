import { AlternatingMonoPattern } from './AlternatingMonoPattern';
import { TaikoDifficultyHitObject } from '../../TaikoDifficultyHitObject';
import { Hit } from '../../../../Objects';

/**
 * Encode colour information for a sequence of {@link TaikoDifficultyHitObject}s. 
 * Consecutive {@link TaikoDifficultyHitObject}s of the same hit type 
 * are encoded within the same {@link MonoStreak}.
 */
export class MonoStreak {
  /**
   * List of {@link DifficultyHitObject}s that are encoded within this {@link MonoStreak}.
   */
  hitObjects: TaikoDifficultyHitObject[] = [];

  /**
   * The parent {@link AlternatingMonoPattern} that contains this {@link MonoStreak}
   */
  declare parent: AlternatingMonoPattern;

  /**
   * Index of this {@link MonoStreak} within it's parent {@link AlternatingMonoPattern}
   */
  index = 0;

  /**
   * The first {@link TaikoDifficultyHitObject} in this {@link MonoStreak}.
   */
  get firstHitObject(): TaikoDifficultyHitObject {
    return this.hitObjects[0];
  }

  /**
   * The hit type of all objects encoded within this {@link MonoStreak}
   */
  get isRim(): boolean {
    return (this.hitObjects[0].baseObject as Hit)?.isRim;
  }

  /**
   * How long the mono pattern encoded within is
   */
  get runLength(): number {
    return this.hitObjects.length;
  }
}
