import {
  CatchHitObject,
  JuiceStream,
  JuiceTinyDroplet,
} from '../Objects';

import { CatchModCombination } from '../Mods/CatchModCombination';

import {
  RulesetBeatmap,
  HitType,
} from 'osu-classes';

export class CatchBeatmap extends RulesetBeatmap {
  mods: CatchModCombination = new CatchModCombination();

  hitObjects: CatchHitObject[] = [];

  get mode(): number {
    return 2;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((c, h) => {
      if (!(h instanceof JuiceStream)) return c;

      return c + h.nestedHitObjects.reduce((c, n) => {
        return c + (n instanceof JuiceTinyDroplet ? 0 : 1);
      }, 0);
    }, this.fruits);
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

  clone(): CatchBeatmap {
    const cloned = new CatchBeatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone() as CatchHitObject);
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;
    cloned.mods = this.mods.clone();

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}
