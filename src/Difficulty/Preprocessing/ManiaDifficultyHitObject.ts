import { DifficultyHitObject, IHitObject } from 'osu-classes';
import { ManiaHitObject } from '../../Objects';

export class ManiaDifficultyHitObject extends DifficultyHitObject {
  /**
   * The hit object wrapped by this difficulty hit object.
   */
  baseObject: ManiaHitObject;

  constructor(
    hitObject: IHitObject,
    lastObject: IHitObject,
    clockRate: number,
    objects: DifficultyHitObject[],
    index: number,
  ) {
    super(hitObject, lastObject, clockRate, objects, index);

    this.baseObject = hitObject as ManiaHitObject;
  }
}
