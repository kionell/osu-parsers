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

import { ModCombination, IMod } from 'osu-resources';

export class StandardModCombination extends ModCombination {
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
          mods.push(new StandardNoFail());
          break;
        case 2:
          mods.push(new StandardEasy());
          break;
        case 4:
          mods.push(new StandardTouchDevice());
          break;
        case 8:
          mods.push(new StandardHidden());
          break;
        case 16:
          mods.push(new StandardHardRock());
          break;
        case 32:
          mods.push(new StandardSuddenDeath());
          break;
        case 64:
          mods.push(new StandardDoubleTime());
          break;
        case 128:
          mods.push(new StandardRelax());
          break;
        case 256:
          mods.push(new StandardHalfTime());
          break;
        case 512:
          mods.push(new StandardNightcore());
          break;
        case 1024:
          mods.push(new StandardFlashlight());
          break;
        case 2048:
          mods.push(new StandardAutoplay());
          break;
        case 4096:
          mods.push(new StandardSpunOut());
          break;
        case 8192:
          mods.push(new StandardAutopilot());
          break;
        case 16384:
          mods.push(new StandardPerfect());
          break;
        case 4194304:
          mods.push(new StandardCinema());
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
      this.all.push(new StandardNoMod());
    }

    this.all.sort((a, b) => a.bitwise - b.bitwise);
  }

  get mode(): number {
    return 0;
  }
}
