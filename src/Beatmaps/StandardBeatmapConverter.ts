import { StandardBeatmap } from './StandardBeatmap';
import { StandardHitObject } from '../Objects/StandardHitObject';
import { Circle } from '../Objects/Circle';
import { Slider } from '../Objects/Slider';
import { Spinner } from '../Objects/Spinner';

import {
  BeatmapConverter,
  IBeatmap,
  IHasPath,
  IHasDuration,
  IHasPosition,
} from 'osu-resources';

export class StandardBeatmapConverter extends BeatmapConverter {
  canConvert(beatmap: IBeatmap): boolean {
    return beatmap.hitObjects.every((h) => {
      return (h as unknown as IHasPosition).startPosition;
    });
  }

  *convertHitObjects(original: IBeatmap): Generator<StandardHitObject> {
    const hitObjects = original.hitObjects;
    const controlPoints = original.controlPoints;

    for (const hitObject of hitObjects) {
      if ((hitObject as unknown as IHasPath).path) {
        const slider = new Slider(hitObject.clone());

        /**
         * Prior to v8, speed multipliers don't adjust for how many
         * ticks are generated over the same distance.
         * This results in more (or less) ticks being generated
         * in <v8 maps for the same time duration.
         */
        slider.tickRate = 1;

        if (original.fileFormat < 8) {
          const diffPoint = controlPoints.difficultyPointAt(slider.startTime);

          slider.tickRate = Math.fround(1) / diffPoint.speedMultiplier;
        }

        yield slider;
      }
      else if ((hitObject as unknown as IHasDuration).endTime) {
        yield new Spinner(hitObject.clone());
      }
      else {
        yield new Circle(hitObject.clone());
      }
    }
  }

  createBeatmap(ooriginal: IBeatmap): StandardBeatmap {
    return new StandardBeatmap(ooriginal);
  }
}
