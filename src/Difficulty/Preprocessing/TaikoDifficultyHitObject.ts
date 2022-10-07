import { DifficultyHitObject, IHitObject } from 'osu-classes';
import { TaikoDifficultyHitObjectRhythm } from './TaikoDifficultyHitObjectRhythm';
import { Hit } from '../../Objects';

/**
 * Represents a single hit object in taiko difficulty calculation.
 */
export class TaikoDifficultyHitObject extends DifficultyHitObject {
  /**
   * List of most common rhythm changes in taiko maps.
   * 
   * The general guidelines for the values are:
   *  - rhythm changes with ratio closer to 1 (that are not 1) are harder to play;
   *  - speeding up is generally harder than slowing down (with exceptions of rhythm changes requiring a hand switch).
   */
  private static readonly COMMON_RHYTHMS: TaikoDifficultyHitObjectRhythm[] = [
    new TaikoDifficultyHitObjectRhythm(1, 1, 0.0),
    new TaikoDifficultyHitObjectRhythm(2, 1, 0.3),
    new TaikoDifficultyHitObjectRhythm(1, 2, 0.5),
    new TaikoDifficultyHitObjectRhythm(3, 1, 0.3),
    new TaikoDifficultyHitObjectRhythm(1, 3, 0.35),
    new TaikoDifficultyHitObjectRhythm(3, 2, 0.6),
    new TaikoDifficultyHitObjectRhythm(2, 3, 0.4),
    new TaikoDifficultyHitObjectRhythm(5, 4, 0.5),
    new TaikoDifficultyHitObjectRhythm(4, 5, 0.7),
  ];

  /**
   * The rhythm required to hit this hit object.
   */
  readonly rhythm: TaikoDifficultyHitObjectRhythm;

  /**
   * The hit type of this hit object.
   */
  readonly isRim?: boolean;

  /**
   * The index of the object in the beatmap.
   */
  readonly objectIndex: number;

  /**
   * Whether the object should carry a penalty due to being hittable using special techniques
   * making it easier to do so.
   */
  staminaCheese = false;

  /**
   * Creates a new difficulty hit object.
   * @param hitObject The gameplay HitObject associated with this difficulty object.
   * @param lastObject The gameplay hit object preceding current object.
   * @param lastLastObject The gameplay hit object preceding last object.
   * @param clockRate The rate of the gameplay clock. Modified by speed-changing mods.
   * @param objectIndex The index of the object in the beatmap.
   * @constructor
   */
  constructor(
    hitObject: IHitObject,
    lastObject: IHitObject,
    lastLastObject: IHitObject,
    clockRate: number,
    objectIndex: number,
  ) {
    super(hitObject, lastObject, clockRate);

    this.rhythm = this._getClosestRhythm(lastObject, lastLastObject, clockRate);
    this.isRim = (hitObject as Hit)?.isRim;

    this.objectIndex = objectIndex;
  }

  /**
   * Returns the closest rhythm change from common rhythms required to hit this object.
   * @param lastObject The gameplay hit object preceding current one.
   * @param lastLastObject The gameplay hit object preceding last object.
   * @param clockRate The rate of the gameplay clock.
   */
  private _getClosestRhythm(lastObject: IHitObject, lastLastObject: IHitObject, clockRate: number) {
    const prevLength = (lastObject.startTime - lastLastObject.startTime) / clockRate;
    const ratio = this.deltaTime / prevLength;

    return TaikoDifficultyHitObject.COMMON_RHYTHMS.slice()
      .sort((a, b) => Math.abs(a.ratio - ratio) - Math.abs(b.ratio - ratio))[0];
  }
}
