import { StandardHitObject } from '../Objects/StandardHitObject';
import { Slider } from '../Objects/Slider';

import {
  HardRock,
  Vector2,
  IApplicableToHitObjects,
  IHitObject,
  HitType,
} from 'osu-classes';

export class StandardHardRock extends HardRock implements IApplicableToHitObjects {
  static BASE_SIZE: Vector2 = new Vector2(512, 384);

  applyToHitObjects(hitObjects: StandardHitObject[]): void {
    hitObjects.forEach((hitObject) => {
      if ((hitObject.hitType & HitType.Slider) === 0) {
        const pos = hitObject.startPosition;

        pos.y = StandardHardRock.BASE_SIZE.y - pos.y;

        return;
      }

      const slider = hitObject as Slider;
      const nestedHitObjects = slider.nestedHitObjects;

      nestedHitObjects.forEach((nested) => {
        const standardObject = (nested as IHitObject) as StandardHitObject;
        const nestedPos = standardObject.startPosition;

        nestedPos.y = StandardHardRock.BASE_SIZE.y - nestedPos.y;
      });

      slider.path.controlPoints.forEach((pathPoint) => {
        pathPoint.position.y *= -1;
      });

      slider.path.invalidate();
    });
  }
}
