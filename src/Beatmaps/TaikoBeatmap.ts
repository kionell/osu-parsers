import { RulesetBeatmap } from 'osu-classes';
import { TaikoModCombination } from '../Mods/TaikoModCombination';
import { TaikoHitObject, Hit, DrumRoll, Swell } from '../Objects';

export class TaikoBeatmap extends RulesetBeatmap {
  mods: TaikoModCombination = new TaikoModCombination();

  hitObjects: TaikoHitObject[] = [];

  get mode(): number {
    return 1;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      return obj instanceof Hit ? combo + 1 : combo;
    }, 0);
  }

  get hits(): Hit[] {
    return this.hitObjects.filter((h) => h instanceof Hit) as Hit[];
  }

  get drumRolls(): DrumRoll[] {
    return this.hitObjects.filter((h) => h instanceof DrumRoll) as DrumRoll[];
  }

  get swells(): Swell[] {
    return this.hitObjects.filter((h) => h instanceof Swell) as Swell[];
  }
}
