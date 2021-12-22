import { StandardModCombination } from '../Mods/StandardModCombination';
import { StandardHitObject } from '../Objects/StandardHitObject';

import { RulesetBeatmap, HitType } from 'osu-classes';

export class StandardBeatmap extends RulesetBeatmap {
  mods: StandardModCombination = new StandardModCombination();

  hitObjects: StandardHitObject[] = [];

  get mode(): number {
    return 0;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      if (obj.hitType & HitType.Normal) {
        return combo + 1;
      }

      if (obj.hitType & HitType.Slider) {
        return combo + obj.nestedHitObjects.length;
      }

      if (obj.hitType & HitType.Spinner) {
        return combo + 1;
      }

      return combo;
    }, 0);
  }

  get circles(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }

  get sliders(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Slider ? 1 : 0);
    }, 0);
  }

  get spinners(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Spinner ? 1 : 0);
    }, 0);
  }

  clone(): StandardBeatmap {
    const cloned = new StandardBeatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone() as StandardHitObject);
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;
    cloned.mods = this.mods.clone();

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}
