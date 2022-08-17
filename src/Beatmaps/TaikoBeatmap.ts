import { RulesetBeatmap, HitType } from 'osu-classes';
import { TaikoModCombination } from '../Mods/TaikoModCombination';
import { TaikoHitObject } from '../Objects/TaikoHitObject';

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
}
