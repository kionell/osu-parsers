import { IHasDuration } from '../../Objects/Types/IHasDuration';
import { IHitObject } from '../../Objects/IHitObject';

/**
 * Wraps a hit object and provides additional information to be used for difficulty calculation.
 */
export class DifficultyHitObject {
  /**
   * The hit object this DifficultyHitObject wraps.
   */
  readonly baseObject: IHitObject;

  /**
   * The last hit object which occurs before base object.
   */
  readonly lastObject: IHitObject;

  /**
   * Amount of time elapsed between base object and last object, adjusted by clockrate.
   */
  readonly deltaTime: number;

  /**
   * Clockrate adjusted start time of base object.
   */
  readonly startTime: number;

  /**
   * Clockrate adjusted end time of base object.
   */
  readonly endTime: number;

  /**
   * Creates a new DifficultyHitObject.
   * @param hitObject The hit object which this DifficultyHitObject wraps.
   * @param lastObject The last hit object which occurs before hit object in the beatmap.
   * @param clockRate The rate at which the gameplay clock is run at.
   */
  constructor(hitObject: IHitObject, lastObject: IHitObject, clockRate: number) {
    this.baseObject = hitObject;
    this.lastObject = lastObject;
    this.deltaTime = (hitObject.startTime - lastObject.startTime) / clockRate;
    this.startTime = hitObject.startTime / clockRate;

    const durationObj = hitObject as unknown as IHasDuration;

    this.endTime = (durationObj?.endTime ?? hitObject.startTime) / clockRate;
  }
}
