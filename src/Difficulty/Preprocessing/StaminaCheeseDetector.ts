import { LimitedCapacityQueue } from 'osu-resources';
import { TaikoDifficultyHitObject } from './TaikoDifficultyHitObject';

/**
 * Detects special hit object patterns which are easier to hit using special techniques
 * than normally assumed in the fully-alternating play style.
 * 
 * This component detects two basic types of patterns, leveraged by the following techniques:
 *  - Rolling allows hitting patterns with quickly and regularly 
 *    alternating notes with a single hand;
 *  - TL tapping makes hitting longer sequences of consecutive 
 *    same-colour notes with little to no colour changes in-between.
 */
export class StaminaCheeseDetector {
  /**
   * The minimum number of consecutive objects with repeating patterns 
   * that can be classified as hittable using a roll.
   */
  private static ROLL_MIN_REPETITIONS = 12;

  /**
   * The minimum number of consecutive objects with repeating patterns that can be classified as hittable using a TL tap.
   */
  private static TL_MIN_REPETITIONS = 16;

  /**
   * The list of all TaikoDifficultyHitObjects in the map.
   */
  private readonly _hitObjects: TaikoDifficultyHitObject[];

  constructor(hitObjects: TaikoDifficultyHitObject[]) {
    this._hitObjects = hitObjects;
  }

  /**
   * Finds and marks all objects in hit object list that special 
   * difficulty-reducing techiques apply to with the stamina cheese flag.
   */
  findCheese(): void {
    this._findRolls(3);
    this._findRolls(4);

    this._findTlTap(0, true);
    this._findTlTap(1, true);
    this._findTlTap(0, false);
    this._findTlTap(1, false);
  }

  /**
   * Finds and marks all sequences hittable using a roll.
   * @param patternLength The length of a single repeating pattern to consider (triplets/quadruplets).
   */
  private _findRolls(patternLength: number): void {
    const history = new LimitedCapacityQueue<TaikoDifficultyHitObject>(2 * patternLength);

    /**
     * for convenience, we're tracking the index of the item *before* 
     * our suspected repeat's start, as that index can be simply subtracted 
     * from the current index to get the number of elements in between
     * without off-by-one errors
     */
    let indexBeforeLastRepeat = -1;
    let lastMarkEnd = 0;

    for (let i = 0; i < this._hitObjects.length; ++i) {
      history.enqueue(this._hitObjects[i]);

      if (!history.full) continue;

      if (!StaminaCheeseDetector._containsPatternRepeat(history, patternLength)) {
        /**
         * we're setting this up for the next iteration, hence the +1.
         * right here this index will point at the queue's front (oldest item),
         * but that item is about to be popped next loop with an enqueue.
         */
        indexBeforeLastRepeat = i - history.count + 1;
        continue;
      }

      const repeatedLength = i - indexBeforeLastRepeat;

      if (repeatedLength < StaminaCheeseDetector.ROLL_MIN_REPETITIONS) {
        continue;
      }

      this._markObjectsAsCheese(Math.max(lastMarkEnd, i - repeatedLength + 1), i);

      lastMarkEnd = i;
    }
  }

  /**
   * Determines whether the objects stored in history 
   * contain a repetition of a pattern of specified length.
   */
  private static _containsPatternRepeat(history: LimitedCapacityQueue<TaikoDifficultyHitObject>, patternLength: number): boolean {
    for (let j = 0; j < patternLength; ++j) {
      if (history.get(j).isRim !== history.get(j + patternLength).isRim) {
        return false;
      }
    }

    return true;
  }

  /**
   * Finds and marks all sequences hittable using a TL tap.
   * @param parity Whether sequences starting with an odd (1) or even-indexed (0) hit object should be checked.
   * @param isRim If the hit is rim or not (used to check for TL taps).
   */
  private _findTlTap(parity: number, isRim: boolean): void {
    let tlLength = -2;
    let lastMarkEnd = 0;

    for (let i = parity; i < this._hitObjects.length; i += 2) {
      tlLength = this._hitObjects[i].isRim === isRim ? tlLength + 2 : -2;

      if (tlLength < StaminaCheeseDetector.TL_MIN_REPETITIONS) continue;

      this._markObjectsAsCheese(Math.max(lastMarkEnd, i - tlLength + 1), i);

      lastMarkEnd = i;
    }
  }

  /**
   * Marks all objects from start to end (inclusive) as stamina cheesed.
   */
  private _markObjectsAsCheese(start: number, end: number): void {
    for (let i = start; i <= end; ++i) {
      this._hitObjects[i].staminaCheese = true;
    }
  }
}
