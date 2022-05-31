import { StandardBeatmap } from './StandardBeatmap';
import { StandardHitObject } from '../Objects/StandardHitObject';
import { Circle } from '../Objects/Circle';
import { Slider } from '../Objects/Slider';
import { Spinner } from '../Objects/Spinner';

import {
  BeatmapConverter,
  HitType,
  IBeatmap,
  IHasPosition,
  IHitObject,
  ISlidableObject,
  ISpinnableObject,
  Vector2,
} from 'osu-classes';

export class StandardBeatmapConverter extends BeatmapConverter {
  canConvert(beatmap: IBeatmap): boolean {
    return beatmap.hitObjects.every((h) => {
      return (h as unknown as IHasPosition).startPosition;
    });
  }

  *convertHitObjects(beatmap: IBeatmap): Generator<StandardHitObject> {
    const hitObjects = beatmap.hitObjects;

    for (const hitObject of hitObjects) {
      if (hitObject instanceof StandardHitObject) {
        yield hitObject.clone();
        continue;
      }

      yield this._convertHitObject(hitObject, beatmap);
    }
  }

  private _convertHitObject(hitObject: IHitObject, beatmap: IBeatmap) {
    const slidable = hitObject as ISlidableObject;
    const spinnable = hitObject as ISpinnableObject;

    if (slidable.path) {
      return this._convertSlider(slidable, beatmap);
    }

    if (spinnable.endTime) {
      return this._convertSpinner(spinnable);
    }

    return this._convertCircle(hitObject);
  }

  private _convertCircle(obj: IHitObject): Circle {
    const converted = new Circle();
    const posObj = obj as unknown as IHasPosition;

    converted.startPosition = posObj?.startPosition ?? new Vector2(0, 0);
    converted.startTime = obj.startTime;
    converted.hitType = HitType.Normal | (obj.hitType & HitType.NewCombo);
    converted.hitSound = obj.hitSound;
    converted.samples = obj.samples;

    return converted;
  }

  private _convertSlider(obj: ISlidableObject, beatmap: IBeatmap): Slider {
    const converted = new Slider();
    const posObj = obj as unknown as IHasPosition;

    converted.startPosition = posObj?.startPosition ?? new Vector2(0, 0);
    converted.startTime = obj.startTime;
    converted.hitType = HitType.Slider | (obj.hitType & HitType.NewCombo);
    converted.hitSound = obj.hitSound;
    converted.repeats = obj.repeats;
    converted.samples = obj.samples;
    converted.nodeSamples = obj.nodeSamples;
    converted.path = obj.path;
    converted.legacyLastTickOffset = obj?.legacyLastTickOffset ?? 0;

    /**
     * Prior to v8, speed multipliers don't adjust for how many
     * ticks are generated over the same distance.
     * This results in more (or less) ticks being generated
     * in <v8 maps for the same time duration.
     */
    converted.tickRate = 1;

    if (beatmap.fileFormat < 8) {
      const diffPoint = beatmap.controlPoints.difficultyPointAt(obj.startTime);

      converted.tickRate = Math.fround(1 / diffPoint.speedMultiplier);
    }

    return converted;
  }

  private _convertSpinner(obj: ISpinnableObject): Spinner {
    const converted = new Spinner();
    const posObj = obj as unknown as IHasPosition;

    converted.startPosition = posObj?.startPosition ?? new Vector2(256, 192);
    converted.startTime = obj.startTime;
    converted.endTime = obj.endTime;
    converted.hitType = HitType.Spinner | (obj.hitType & HitType.NewCombo);
    converted.hitSound = obj.hitSound;
    converted.samples = obj.samples;

    return converted;
  }

  createBeatmap(): StandardBeatmap {
    return new StandardBeatmap();
  }
}
