import { ModCombination, IMod } from 'osu-classes';

import { StandardNoMod } from './StandardNoMod';
import { StandardNoFail } from './StandardNoFail';
import { StandardEasy } from './StandardEasy';
import { StandardTouchDevice } from './StandardTouchDevice';
import { StandardHidden } from './StandardHidden';
import { StandardHardRock } from './StandardHardRock';
import { StandardSuddenDeath } from './StandardSuddenDeath';
import { StandardDoubleTime } from './StandardDoubleTime';
import { StandardRelax } from './StandardRelax';
import { StandardHalfTime } from './StandardHalfTime';
import { StandardNightcore } from './StandardNightcore';
import { StandardFlashlight } from './StandardFlashlight';
import { StandardAutoplay } from './StandardAutoplay';
import { StandardSpunOut } from './StandardSpunOut';
import { StandardAutopilot } from './StandardAutopilot';
import { StandardPerfect } from './StandardPerfect';
import { StandardCinema } from './StandardCinema';

export class StandardModCombination extends ModCombination {
  get mode(): number {
    return 0;
  }

  protected get _availableMods(): IMod[] {
    return [
      new StandardNoMod(),
      new StandardNoFail(),
      new StandardEasy(),
      new StandardTouchDevice(),
      new StandardHidden(),
      new StandardHardRock(),
      new StandardSuddenDeath(),
      new StandardDoubleTime(),
      new StandardRelax(),
      new StandardHalfTime(),
      new StandardNightcore(),
      new StandardFlashlight(),
      new StandardAutoplay(),
      new StandardSpunOut(),
      new StandardAutopilot(),
      new StandardPerfect(),
      new StandardCinema(),
    ];
  }
}
