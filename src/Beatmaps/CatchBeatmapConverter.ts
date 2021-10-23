import { CatchBeatmap } from './CatchBeatmap';
import { CatchHitObject } from '../Objects/CatchHitObject';
import { Fruit } from '../Objects/Fruit';
import { JuiceStream } from '../Objects/JuiceStream';
import { BananaShower } from '../Objects/BananaShower';

import {
  BeatmapConverter,
  IBeatmap,
  IHasPath,
  IHasDuration,
  IHasX,
} from 'osu-resources';

export class CatchBeatmapConverter extends BeatmapConverter {
  canConvert(beatmap: IBeatmap): boolean {
    return beatmap.hitObjects.every((h) => {
      return Number.isFinite((h as unknown as IHasX).startX);
    });
  }

  *convertHitObjects(original: IBeatmap): Generator<CatchHitObject> {
    const hitObjects = original.hitObjects;

    for (const hitObject of hitObjects) {
      if (((hitObject as unknown) as IHasPath).path) {
        yield new JuiceStream(hitObject);
      }
      else if (((hitObject as unknown) as IHasDuration).endTime) {
        yield new BananaShower(hitObject);
      }
      else {
        yield new Fruit(hitObject);
      }
    }
  }

  createBeatmap(original: IBeatmap): CatchBeatmap {
    return new CatchBeatmap(original);
  }
}
