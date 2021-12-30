import { TaikoModCombination } from '../Mods/TaikoModCombination';
import { TaikoHitObject } from '../Objects/TaikoHitObject';

import { RulesetBeatmap, HitType } from 'osu-classes';

export class TaikoBeatmap extends RulesetBeatmap {
  mods: TaikoModCombination = new TaikoModCombination();

  hitObjects: TaikoHitObject[] = [];

  get mode(): number {
    return 1;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      return obj.hitType & HitType.Normal ? combo + 1 : combo;
    }, 0);
  }

  get hits(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }

  get drumRolls(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Slider ? 1 : 0);
    }, 0);
  }

  get swells(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Spinner ? 1 : 0);
    }, 0);
  }

  clone(): TaikoBeatmap {
    const cloned = new TaikoBeatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone() as TaikoHitObject);
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;
    cloned.mods = this.mods.clone();

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}
