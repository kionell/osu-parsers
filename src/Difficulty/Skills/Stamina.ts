import { ModCombination, LimitedCapacityQueue, StrainDecaySkill, DifficultyHitObject } from 'osu-resources';
import { TaikoDifficultyHitObject } from '../Preprocessing/TaikoDifficultyHitObject';
import { Hit } from '../../Objects';

/**
 * Calculates the stamina coefficient of taiko difficulty.
 * The reference play style chosen uses two hands, 
 * with full alternating (the hand changes after every hit).
 */
export class Stamina extends StrainDecaySkill {
  /**
   * Maximum number of entries to keep in notePairDurationHistory.
   */
  private static _MAX_HISTORY_LENGTH = 2;

  /**
   * The index of the hand this Stamina instance is associated with.
   * The value of 0 indicates the left hand (full alternating gameplay starting with left hand is assumed).
   * This naturally translates onto index offsets of the objects in the map.
   */
  private readonly _hand: number;

  /**
   * Stores the last max_history_length durations between notes hit with the hand indicated by hand.
   */
  private readonly _notePairDurationHistory = new LimitedCapacityQueue<number>(Stamina._MAX_HISTORY_LENGTH);

  /**
   * Stores delta time of the last object that was hit by the other hand.
   */
  private _offhandObjectDuration = 1.7976931348623157E+308;

  protected _skillMultiplier = 1;
  protected _strainDecayBase = 0.4;

  /**
   * Creates a Stamina skill.
   * @param mods Mods for use in skill calculations.
   * @param rightHand Whether this instance is performing calculations for the right hand.
   */
  constructor(mods: ModCombination, rightHand: boolean) {
    super(mods);

    this._hand = rightHand ? 1 : 0;
  }

  protected _strainValueOf(current: DifficultyHitObject): number {
    if (!(current.baseObject instanceof Hit)) return 0;

    const hitObject = current as TaikoDifficultyHitObject;

    if (hitObject.objectIndex % 2 === this._hand) {
      let objectStrain = 1;

      if (hitObject.objectIndex === 1) return 1;

      this._notePairDurationHistory.enqueue(hitObject.deltaTime + this._offhandObjectDuration);

      const shortestRecentNote = Math.min(...this._notePairDurationHistory.enumerate());

      objectStrain += Stamina._speedBonus(shortestRecentNote);

      if (hitObject.staminaCheese) {
        objectStrain *= Stamina._cheesePenalty(hitObject.deltaTime + this._offhandObjectDuration);
      }

      return objectStrain;
    }

    this._offhandObjectDuration = hitObject.deltaTime;

    return 0;
  }

  /**
   * Applies a penalty for hit objects marked with TaikoDifficultyHitObject.StaminaCheese.
   * @param notePairDuration The duration between the current and previous note hit using the hand indicated by hand.
   */
  private static _cheesePenalty(notePairDuration: number) {
    if (notePairDuration > 125) return 1;
    if (notePairDuration < 100) return 0.6;

    return 0.6 + (notePairDuration - 100) * 0.016;
  }

  /**
   * Applies a speed bonus dependent on the time since the last hit performed using this hand.
   * @param notePairDuration The duration between the current and previous note hit using the hand indicated by hand.
   */
  private static _speedBonus(notePairDuration: number) {
    if (notePairDuration >= 200) return 0;

    return (200 - notePairDuration) ** 2 / 100000;
  }
}
