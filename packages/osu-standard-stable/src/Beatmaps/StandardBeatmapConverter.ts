import { StandardBeatmap } from './StandardBeatmap';
import { StandardHitObject } from '../Objects/StandardHitObject';
import { Circle } from '../Objects/Circle';
import { Slider } from '../Objects/Slider';
import { Spinner } from '../Objects/Spinner';

import {
  BeatmapConverter,
  IBeatmap,
  IHasCombo,
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

    if (typeof spinnable.endTime === 'number') {
      return this._convertSpinner(spinnable);
    }

    return this._convertCircle(hitObject);
  }

  private _convertCircle(obj: IHitObject): Circle {
    const converted = new Circle();

    this._copyProperties(converted, obj);

    return converted;
  }

  private _convertSlider(obj: ISlidableObject, beatmap: IBeatmap): Slider {
    const converted = new Slider();

    this._copyProperties(converted, obj);

    converted.repeats = obj.repeats;
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

      converted.tickRate = Math.fround(1 / diffPoint.sliderVelocity);
    }

    return converted;
  }

  private _convertSpinner(obj: ISpinnableObject): Spinner {
    const converted = new Spinner();

    this._copyProperties(converted, obj);

    converted.endTime = obj.endTime;

    return converted;
  }

  private _copyProperties(converted: StandardHitObject, obj: IHitObject): void {
    const posObj = obj as ISpinnableObject & IHasPosition;
    const comboObj = obj as ISpinnableObject & IHasCombo;

    converted.startPosition = posObj?.startPosition ?? new Vector2(0, 0);
    converted.startTime = obj.startTime;
    converted.hitType = obj.hitType;
    converted.hitSound = obj.hitSound;
    converted.samples = obj.samples;
    converted.comboOffset = comboObj?.comboOffset ?? 0;
    converted.isNewCombo = comboObj?.isNewCombo ?? false;
  }

  createBeatmap(): StandardBeatmap {
    return new StandardBeatmap();
  }
}
