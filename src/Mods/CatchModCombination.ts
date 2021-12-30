import { CatchNoMod } from './CatchNoMod';
import { CatchNoFail } from './CatchNoFail';
import { CatchEasy } from './CatchEasy';
import { CatchHidden } from './CatchHidden';
import { CatchHardRock } from './CatchHardRock';
import { CatchSuddenDeath } from './CatchSuddenDeath';
import { CatchDoubleTime } from './CatchDoubleTime';
import { CatchRelax } from './CatchRelax';
import { CatchHalfTime } from './CatchHalfTime';
import { CatchNightcore } from './CatchNightcore';
import { CatchFlashlight } from './CatchFlashlight';
import { CatchAutoplay } from './CatchAutoplay';
import { CatchPerfect } from './CatchPerfect';
import { CatchCinema } from './CatchCinema';

import { ModCombination, IMod } from 'osu-classes';

export class CatchModCombination extends ModCombination {
  get mode(): number {
    return 2;
  }

  protected get _availableMods(): IMod[] {
    return [
      new CatchNoMod(),
      new CatchNoFail(),
      new CatchEasy(),
      new CatchHidden(),
      new CatchHardRock(),
      new CatchSuddenDeath(),
      new CatchDoubleTime(),
      new CatchRelax(),
      new CatchHalfTime(),
      new CatchNightcore(),
      new CatchFlashlight(),
      new CatchAutoplay(),
      new CatchPerfect(),
      new CatchCinema(),
    ];
  }

  clone(): CatchModCombination {
    return new CatchModCombination(this.bitwise);
  }
}
