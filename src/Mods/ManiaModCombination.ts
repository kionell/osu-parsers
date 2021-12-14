import { ModCombination, IMod } from 'osu-resources';

import { ManiaNoMod } from './ManiaNoMod';
import { ManiaNoFail } from './ManiaNoFail';
import { ManiaEasy } from './ManiaEasy';
import { ManiaHidden } from './ManiaHidden';
import { ManiaFadeIn } from './ManiaFadeIn';
import { ManiaHardRock } from './ManiaHardRock';
import { ManiaSuddenDeath } from './ManiaSuddenDeath';
import { ManiaDoubleTime } from './ManiaDoubleTime';
import { ManiaHalfTime } from './ManiaHalfTime';
import { ManiaNightcore } from './ManiaNightcore';
import { ManiaFlashlight } from './ManiaFlashlight';
import { ManiaAutoplay } from './ManiaAutoplay';
import { ManiaPerfect } from './ManiaPerfect';
import { ManiaCinema } from './ManiaCinema';
import { ManiaKey1 } from './ManiaKey1';
import { ManiaKey2 } from './ManiaKey2';
import { ManiaKey3 } from './ManiaKey3';
import { ManiaKey4 } from './ManiaKey4';
import { ManiaKey5 } from './ManiaKey5';
import { ManiaKey6 } from './ManiaKey6';
import { ManiaKey7 } from './ManiaKey7';
import { ManiaKey8 } from './ManiaKey8';
import { ManiaKey9 } from './ManiaKey9';
import { ManiaRandom } from './ManiaRandom';
import { ManiaDualStages } from './ManiaDualStages';
import { ManiaMirror } from './ManiaMirror';

export class ManiaModCombination extends ModCombination {
  get mode(): number {
    return 3;
  }

  protected get _availableMods(): IMod[] {
    return [
      new ManiaNoMod(),
      new ManiaNoFail(),
      new ManiaEasy(),
      new ManiaHidden(),
      new ManiaFadeIn(),
      new ManiaHardRock(),
      new ManiaSuddenDeath(),
      new ManiaDoubleTime(),
      new ManiaHalfTime(),
      new ManiaNightcore(),
      new ManiaFlashlight(),
      new ManiaAutoplay(),
      new ManiaPerfect(),
      new ManiaCinema(),
      new ManiaKey1(),
      new ManiaKey2(),
      new ManiaKey3(),
      new ManiaKey4(),
      new ManiaKey5(),
      new ManiaKey6(),
      new ManiaKey7(),
      new ManiaKey8(),
      new ManiaKey9(),
      new ManiaRandom(),
      new ManiaDualStages(),
      new ManiaMirror(),
    ];
  }
}
