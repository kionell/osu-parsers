import { IHasDuration } from '../../Objects/Types/IHasDuration';
import { IHitObject } from '../../Objects/IHitObject';
import * as internal from 'stream';

/**
 * Wraps a hit object and provides additional information to be used for difficulty calculation.
 */
export class DifficultyHitObject {
  
  private readonly _difficultyHitObjects: ReadonlyArray<DifficultyHitObject>;
  
  /**
   * The index of this {@link DifficultyHitObject} in the list of all {@link DifficultyHitObject}s.
   */
  readonly index: number;
  /**
   * The {@link hitObject} this {@link DifficultyHitObject} wraps.
   */
  readonly baseObject: IHitObject;

  /**
   * The last hit object which occurs before {@link hitObject}.
   */
  readonly lastObject: IHitObject;

  /**
   * Amount of time elapsed between {@link baseObject} and {@link lastObject}, adjusted by clockrate.
   */
  readonly deltaTime: number;

  /**
   * Clockrate adjusted start time of {@link baseObject}.
   */
  readonly startTime: number;

  /**
   * Clockrate adjusted end time of {@link baseObject}.
   */
  readonly endTime: number;

  /**
   * Creates a new {@link DifficultyHitObject}.
   * @param hitObject The hit object which this {@link DifficultyHitObject} wraps.
   * @param lastObject The last hit object which occurs before hit object in the beatmap.
   * @param clockRate The rate at which the gameplay clock is run at.
   * @param objects The list of {@link DifficultyHitObject}s in the current map
   * @param index The index of this {@link DifficultyHitObject} in {@link objects} list.
   */
  constructor(hitObject: IHitObject, lastObject: IHitObject, clockRate: number, objects: Array<DifficultyHitObject>,  index: number) {
    this._difficultyHitObjects = objects;
    this.index = index;
    this.baseObject = hitObject;
    this.lastObject = lastObject;
    this.deltaTime = (hitObject.startTime - lastObject.startTime) / clockRate;
    this.startTime = hitObject.startTime / clockRate;

    const durationObj = hitObject as unknown as IHasDuration;

    this.endTime = (durationObj?.endTime ?? hitObject.startTime) / clockRate;
  }

  // TODO
  _previous(backwardsIndex: number) {
    return this._difficultyHitObjects[(this.index - (backwardsIndex + 1))] ?? null;
  };
  _next(forwardsIndex: number) {
    return this._difficultyHitObjects[(this.index + (forwardsIndex + 1))] ?? null;
  };
}
