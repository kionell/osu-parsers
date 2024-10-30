import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Autoplay implements IMod {
  name = 'Autoplay';

  acronym = 'AT';

  bitwise: ModBitwise = ModBitwise.Autoplay;

  type: ModType = ModType.Automation;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.NoFail |
    ModBitwise.SuddenDeath |
    ModBitwise.Perfect |
    ModBitwise.Relax |
    ModBitwise.Relax2 |
    ModBitwise.SpunOut |
    ModBitwise.Cinema;
}
