import { RulesetBeatmap } from 'osu-classes';
import { StandardModCombination } from '../Mods/StandardModCombination';
import { StandardHitObject, Circle, Slider, Spinner } from '../Objects';

export class StandardBeatmap extends RulesetBeatmap {
  mods: StandardModCombination = new StandardModCombination();

  hitObjects: StandardHitObject[] = [];

  get mode(): number {
    return 0;
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      if (obj instanceof Circle) {
        return combo + 1;
      }

      if (obj instanceof Slider) {
        return combo + obj.nestedHitObjects.length;
      }

      if (obj instanceof Spinner) {
        return combo + 1;
      }

      return combo;
    }, 0);
  }

  /**
   * A list of circles of this beatmap.
   */
  get circles(): Circle[] {
    return this.hitObjects.filter((h) => h instanceof Circle) as Circle[];
  }

  /**
   * A list of sliders of this beatmap.
   */
  get sliders(): Slider[] {
    return this.hitObjects.filter((h) => h instanceof Slider) as Slider[];
  }

  /**
   * A list of spinners of this beatmap.
   */
  get spinners(): Spinner[] {
    return this.hitObjects.filter((h) => h instanceof Spinner) as Spinner[];
  }
}
