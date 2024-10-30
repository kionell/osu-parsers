import {
  HardRock,
  Vector2,
  IApplicableToHitObjects,
} from 'osu-classes';

import {
  StandardHitObject,
  Slider,
  SliderRepeat,
  SliderTick,
} from '../Objects';

export class StandardHardRock extends HardRock implements IApplicableToHitObjects {
  static BASE_SIZE: Vector2 = new Vector2(512, 384);

  applyToHitObjects(hitObjects: StandardHitObject[]): void {
    /**
     * osu!lazer doesn't flip stacked objects when applies HR.
     * So flipped maps aren't actually symmetrical.
     * If we skip this process we may get a slightly 
     * different star rating & performance. 
     */
    hitObjects.forEach((hitObject) => {
      StandardHardRock._reflectVertically(hitObject);
    });
  }

  private static _reflectVertically(hitObject: StandardHitObject) {
    hitObject.startY = StandardHardRock.BASE_SIZE.y - hitObject.startY;

    if (!(hitObject instanceof Slider)) return;

    const slider = hitObject as Slider;
    const nestedHitObjects = slider.nestedHitObjects as StandardHitObject[];

    nestedHitObjects.forEach((nested) => {
      if (nested instanceof SliderTick || nested instanceof SliderRepeat) {
        nested.startY = StandardHardRock.BASE_SIZE.y - nested.startY;
      }
    });

    slider.path.controlPoints.forEach((point) => {
      point.position.y *= -1;
    });

    slider.path.invalidate();

    slider.endY = slider.endPosition.y;
  }
}
