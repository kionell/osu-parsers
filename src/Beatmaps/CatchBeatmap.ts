import { CatchHitObject } from '../Objects/CatchHitObject';
import { CatchModCombination } from '../Mods/CatchModCombination';

import {
  RulesetBeatmap,
  HitType,
  NestedType,
} from 'osu-resources';

export class CatchBeatmap extends RulesetBeatmap {
  mods: CatchModCombination = new CatchModCombination();

  hitObjects: CatchHitObject[] = [];

  get mode(): number {
    return 2;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      if (obj.hitType & HitType.Normal) {
        return combo + 1;
      }

      if (obj.hitType & HitType.Slider) {
        return combo + obj.nestedHitObjects.reduce((c, n) => {
          return c + Number(n.nestedType !== NestedType.JuiceDroplet);
        }, 0);
      }

      return combo;
    }, 0);
  }

  get fruits(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }

  get juiceStreams(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Slider ? 1 : 0);
    }, 0);
  }

  get bananaShowers(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Spinner ? 1 : 0);
    }, 0);
  }
}
