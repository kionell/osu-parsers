import { CatchBeatmap } from './CatchBeatmap';
import { CatchHitObject } from '../Objects/CatchHitObject';
import { Fruit } from '../Objects/Fruit';
import { JuiceStream } from '../Objects/JuiceStream';
import { BananaShower } from '../Objects/BananaShower';

import {
  BeatmapConverter,
  IBeatmap,
  IHasPosition,
  IHasX,
  IHitObject,
  ISlidableObject,
  ISpinnableObject,
} from 'osu-resources';

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
        yield hitObject.clone() as CatchHitObject;
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

    converted.repeats = slidable.repeats;
    converted.nodeSamples = slidable.nodeSamples.map((n) => n.map((s) => s.clone()));
    converted.path = slidable.path.clone();
    converted.legacyLastTickOffset = slidable?.legacyLastTickOffset ?? 0;

    return converted;
  }

  private _convertSpinnableObject(spinnable: ISpinnableObject) {
    const converted = new BananaShower();

    this._copyBaseProperties(spinnable, converted);

    converted.endTime = spinnable.endTime;

    return converted;
  }

  private _convertHittableObject(hittable: IHitObject) {
    const converted = new Fruit();

    this._copyBaseProperties(hittable, converted);

    return converted;
  }

  private _copyBaseProperties(hitObject: IHitObject, converted: CatchHitObject): void {
    const posObj = hitObject as unknown as IHasPosition;

    converted.startX = posObj?.startX ?? 0;
    converted.startY = posObj?.startY ?? 192;
    converted.startTime = hitObject.startTime;
    converted.hitType = hitObject.hitType;
    converted.hitSound = hitObject.hitSound;
    converted.samples = hitObject.samples.map((s) => s.clone());
  }

  createBeatmap(): CatchBeatmap {
    return new CatchBeatmap();
  }
}
