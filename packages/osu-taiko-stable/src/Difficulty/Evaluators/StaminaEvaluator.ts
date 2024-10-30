import { DifficultyHitObject } from 'osu-classes';
import { Hit } from '../../Objects';
import { TaikoDifficultyHitObject } from '../Preprocessing';

export class StaminaEvaluator {
  /**
   * Applies a speed bonus dependent on the time since the last hit performed using this key.
   * @param interval The interval between the current and previous note hit using the same key.
   */
  private static _speedBonus(interval: number): number {
    /**
     * Cap to 600bpm 1/4, 25ms note interval, 50ms key interval
     * Interval will be capped at a very small value to avoid infinite/negative speed bonuses.
     * TODO - This is a temporary measure as we need to implement 
     * methods of detecting playstyle-abuse of speed bonus.
     */
    interval = Math.max(interval, 50);

    return 30 / interval;
  }

  /**
   * Evaluates the minimum mechanical stamina required to play 
   * the current object. This is calculated using the maximum possible interval 
   * between two hits using the same key, by alternating 2 keys for each colour.
   */
  static evaluateDifficultyOf(current: DifficultyHitObject): number {
    if (!(current.baseObject instanceof Hit)) return 0;

    /**
     * Find the previous hit object hit by the current key, 
     * which is two notes of the same colour prior.
     */
    const taikoCurrent = current as TaikoDifficultyHitObject;
    const keyPrevious = taikoCurrent.previousMono(1);

    /**
     * There is no previous hit object hit by the current key.
     */
    if (keyPrevious === null) return 0;

    /**
     * Add a base strain to all objects.
     */
    let objectStrain = 0.5;

    objectStrain += this._speedBonus(taikoCurrent.startTime - keyPrevious.startTime);

    return objectStrain;
  }
}
