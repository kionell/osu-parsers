import {
  BeatmapConverter,
  HitType,
  IBeatmap,
  IHasCombo,
  IHasPosition,
  IHasX,
  IHitObject,
  ISlidableObject,
  ISpinnableObject,
} from 'osu-classes';

import {
  CatchHitObject,
  Fruit,
  JuiceStream,
  BananaShower,
} from '../Objects';

import { CatchBeatmap } from './CatchBeatmap';

export class CatchBeatmapConverter extends BeatmapConverter {
  canConvert(beatmap: IBeatmap): boolean {
    return beatmap.hitObjects.every((h) => {
      return Number.isFinite((h as unknown as IHasX).startX);
    });
  }

  *convertHitObjects(beatmap: IBeatmap): Generator<CatchHitObject> {
    const hitObjects = beatmap.hitObjects;

    for (const hitObject of hitObjects) {
      if (hitObject instanceof CatchHitObject) {
        yield hitObject;
        continue;
      }

      yield this._convertHitObject(hitObject);
    }
  }

  private _convertHitObject(hitObject: IHitObject) {
    const slidable = hitObject as ISlidableObject;
    const spinnable = hitObject as ISpinnableObject;

    if (slidable.path) {
      return this._convertSlidableObject(slidable);
    }

    if (spinnable.endTime) {
      return this._convertSpinnableObject(spinnable);
    }

    return this._convertHittableObject(hitObject);
  }

  private _convertSlidableObject(slidable: ISlidableObject) {
    const converted = new JuiceStream();

    this._copyBaseProperties(slidable, converted);

    converted.hitType = HitType.Slider | (slidable.hitType & HitType.NewCombo);
    converted.repeats = slidable.repeats;
    converted.nodeSamples = slidable.nodeSamples;
    converted.path = slidable.path;
    converted.legacyLastTickOffset = slidable?.legacyLastTickOffset ?? 0;

    return converted;
  }

  private _convertSpinnableObject(spinnable: ISpinnableObject) {
    const converted = new BananaShower();

    this._copyBaseProperties(spinnable, converted);

    converted.hitType = HitType.Spinner | (spinnable.hitType & HitType.NewCombo);
    converted.endTime = spinnable.endTime;

    return converted;
  }

  private _convertHittableObject(hittable: IHitObject) {
    const converted = new Fruit();

    this._copyBaseProperties(hittable, converted);

    converted.hitType |= hittable.hitType & HitType.NewCombo;

    return converted;
  }

  private _copyBaseProperties(hitObject: IHitObject, converted: CatchHitObject): void {
    const posObj = hitObject as IHitObject & IHasPosition;
    const comboObj = hitObject as IHitObject & IHasCombo;

    converted.startX = posObj?.startX ?? 0;
    converted.startY = posObj?.startY ?? 192;
    converted.startTime = hitObject.startTime;
    converted.hitSound = hitObject.hitSound;
    converted.samples = hitObject.samples;
    converted.comboOffset = comboObj.comboOffset;
  }

  createBeatmap(): CatchBeatmap {
    return new CatchBeatmap();
  }
}
