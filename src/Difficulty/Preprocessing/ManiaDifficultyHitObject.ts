import { DifficultyHitObject, IHitObject } from 'osu-resources';
import { ManiaHitObject } from '../../Objects';

export class ManiaDifficultyHitObject extends DifficultyHitObject {
  /**
   * The hit object wrapped by this difficulty hit object.
   */
  baseObject: ManiaHitObject;

  constructor(hitObject: IHitObject, lastObject: IHitObject, clockRate: number) {
    super(hitObject, lastObject, clockRate);

    this.baseObject = hitObject as ManiaHitObject;
  }
}
