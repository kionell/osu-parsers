import {
  HardRock,
  Vector2,
  IApplicableToHitObjects,
  PathPoint,
  SliderPath,
  PathType,
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
    hitObjects.forEach((hitObject) => {
      StandardHardRock._reflectVertically(hitObject);
    });
  }

  private static _reflectVertically(hitObject: StandardHitObject) {
    const x = hitObject.startX;
    const y = StandardHardRock.BASE_SIZE.y - hitObject.startY;

    hitObject.startPosition = new Vector2(x, y);

    if (!(hitObject instanceof Slider)) return;

    const slider = hitObject as Slider;
    const nestedHitObjects = slider.nestedHitObjects as StandardHitObject[];

    nestedHitObjects.forEach((nested) => {
      if (nested instanceof SliderTick || nested instanceof SliderRepeat) {
        const x = nested.startX;
        const y = StandardHardRock.BASE_SIZE.y - nested.startY;

        nested.startPosition = new Vector2(x, y);
      }
    });

    const controlPoints = slider.path.controlPoints.map((p) => new PathPoint(p.position, p.type));
    const curveType = controlPoints[0].type as PathType;

    controlPoints.forEach((point) => {
      point.position = new Vector2(point.position.x, -point.position.y);
    });

    slider.path = new SliderPath(curveType, controlPoints, slider.path.expectedDistance);
  }
}
