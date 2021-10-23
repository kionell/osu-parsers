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
          mods.push(new TaikoNoFail());
          break;
        case 2:
          mods.push(new TaikoEasy());
          break;
        case 8:
          mods.push(new TaikoHidden());
          break;
        case 16:
          mods.push(new TaikoHardRock());
          break;
        case 32:
          mods.push(new TaikoSuddenDeath());
          break;
        case 64:
          mods.push(new TaikoDoubleTime());
          break;
        case 128:
          mods.push(new TaikoRelax());
          break;
        case 256:
          mods.push(new TaikoHalfTime());
          break;
        case 512:
          mods.push(new TaikoNightcore());
          break;
        case 1024:
          mods.push(new TaikoFlashlight());
          break;
        case 2048:
          mods.push(new TaikoAutoplay());
          break;
        case 16384:
          mods.push(new TaikoPerfect());
          break;
        case 4194304:
          mods.push(new TaikoCinema());
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
      this.all.push(new TaikoNoMod());
    }

    this.all.sort((a, b) => a.bitwise - b.bitwise);
  }

  get mode(): number {
    return 1;
  }
}
