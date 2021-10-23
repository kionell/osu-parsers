import { ModCombination, IMod, ModBitwise } from 'osu-resources';

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
  constructor(bitwise?: number) {
    super();

    if (typeof bitwise !== 'number') {
      return;
    }

    const mods: IMod[] = [];

    let currentFlag = 0;

    while (bitwise > 0) {
      switch (bitwise & (1 << currentFlag)) {
        case ModBitwise.NoFail:
          mods.push(new ManiaNoFail());
          break;
        case ModBitwise.Easy:
          mods.push(new ManiaEasy());
          break;
        case ModBitwise.Hidden:
          mods.push(new ManiaHidden());
          break;
        case ModBitwise.HardRock:
          mods.push(new ManiaHardRock());
          break;
        case ModBitwise.SuddenDeath:
          mods.push(new ManiaSuddenDeath());
          break;
        case ModBitwise.DoubleTime:
          mods.push(new ManiaDoubleTime());
          break;
        case ModBitwise.HalfTime:
          mods.push(new ManiaHalfTime());
          break;
        case ModBitwise.Nightcore:
          mods.push(new ManiaNightcore());
          break;
        case ModBitwise.Flashlight:
          mods.push(new ManiaFlashlight());
          break;
        case ModBitwise.Autoplay:
          mods.push(new ManiaAutoplay());
          break;
        case ModBitwise.Perfect:
          mods.push(new ManiaPerfect());
          break;
        case ModBitwise.Key4:
          mods.push(new ManiaKey4());
          break;
        case ModBitwise.Key5:
          mods.push(new ManiaKey5());
          break;
        case ModBitwise.Key6:
          mods.push(new ManiaKey6());
          break;
        case ModBitwise.Key7:
          mods.push(new ManiaKey7());
          break;
        case ModBitwise.Key8:
          mods.push(new ManiaKey8());
          break;
        case ModBitwise.FadeIn:
          mods.push(new ManiaFadeIn());
          break;
        case ModBitwise.Random:
          mods.push(new ManiaRandom());
          break;
        case ModBitwise.Cinema:
          mods.push(new ManiaCinema());
          break;
        case ModBitwise.Key9:
          mods.push(new ManiaKey9());
          break;
        case ModBitwise.KeyCoop:
          mods.push(new ManiaDualStages());
          break;
        case ModBitwise.Key1:
          mods.push(new ManiaKey1());
          break;
        case ModBitwise.Key3:
          mods.push(new ManiaKey3());
          break;
        case ModBitwise.Key2:
          mods.push(new ManiaKey2());
          break;
        case ModBitwise.Mirror:
          mods.push(new ManiaMirror());
      }

      // Make the processed bit equal to 0.
      bitwise &= ~(1 << currentFlag++);
    }

    for (let i = mods.length - 1; i >= 0; --i) {
      if (this.bitwise & mods[i].incompatibles) {
        continue;
      }

      this.all.push(mods[i]);
    }

    if (!this.all.length) {
      this.all.push(new ManiaNoMod());
    }

    this.all.sort((a, b) => a.bitwise - b.bitwise);
  }

  get mode(): number {
    return 3;
  }
}
