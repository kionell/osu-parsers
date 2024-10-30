import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Relax implements IMod {
  name = 'Relax';

  acronym = 'RX';

  bitwise: ModBitwise = ModBitwise.Relax;

  type: ModType = ModType.Automation;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.NoFail |
    ModBitwise.SuddenDeath |
    ModBitwise.Perfect |
    ModBitwise.Autoplay |
    ModBitwise.Cinema |
    ModBitwise.Relax2;
}
