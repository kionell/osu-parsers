import { ModCombination, IMod } from 'osu-resources';

import { TaikoNoMod } from './TaikoNoMod';
import { TaikoNoFail } from './TaikoNoFail';
import { TaikoEasy } from './TaikoEasy';
import { TaikoHidden } from './TaikoHidden';
import { TaikoHardRock } from './TaikoHardRock';
import { TaikoSuddenDeath } from './TaikoSuddenDeath';
import { TaikoDoubleTime } from './TaikoDoubleTime';
import { TaikoRelax } from './TaikoRelax';
import { TaikoHalfTime } from './TaikoHalfTime';
import { TaikoNightcore } from './TaikoNightcore';
import { TaikoFlashlight } from './TaikoFlashlight';
import { TaikoAutoplay } from './TaikoAutoplay';
import { TaikoPerfect } from './TaikoPerfect';
import { TaikoCinema } from './TaikoCinema';

export class TaikoModCombination extends ModCombination {
  get mode(): number {
    return 1;
  }

  protected get _availableMods(): IMod[] {
    return [
      new TaikoNoMod(),
      new TaikoNoFail(),
      new TaikoEasy(),
      new TaikoHidden(),
      new TaikoHardRock(),
      new TaikoSuddenDeath(),
      new TaikoDoubleTime(),
      new TaikoRelax(),
      new TaikoHalfTime(),
      new TaikoNightcore(),
      new TaikoFlashlight(),
      new TaikoAutoplay(),
      new TaikoPerfect(),
      new TaikoCinema(),
    ];
  }
}
