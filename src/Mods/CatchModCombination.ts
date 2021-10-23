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

import { ModCombination, IMod } from 'osu-resources';

export class CatchModCombination extends ModCombination {
  constructor(bitwise?: number) {
    super();

    if (typeof bitwise !== 'number') {
      return;
    }

    const mods: IMod[] = [];

    let currentFlag = 0;

    while (bitwise > 0) {
      switch (bitwise & (1 << currentFlag)) {
        case 1:
          mods.push(new CatchNoFail());
          break;
        case 2:
          mods.push(new CatchEasy());
          break;
        case 8:
          mods.push(new CatchHidden());
          break;
        case 16:
          mods.push(new CatchHardRock());
          break;
        case 32:
          mods.push(new CatchSuddenDeath());
          break;
        case 64:
          mods.push(new CatchDoubleTime());
          break;
        case 128:
          mods.push(new CatchRelax());
          break;
        case 256:
          mods.push(new CatchHalfTime());
          break;
        case 512:
          mods.push(new CatchNightcore());
          break;
        case 1024:
          mods.push(new CatchFlashlight());
          break;
        case 2048:
          mods.push(new CatchAutoplay());
          break;
        case 16384:
          mods.push(new CatchPerfect());
          break;
        case 4194304:
          mods.push(new CatchCinema());
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
      this.all.push(new CatchNoMod());
    }

    this.all.sort((a, b) => a.bitwise - b.bitwise);
  }

  get mode(): number {
    return 2;
  }
}
