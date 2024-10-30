import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class NoMod implements IMod {
  name = 'No Mod';

  acronym = 'NM';

  bitwise: ModBitwise = ModBitwise.None;

  type: ModType = ModType.System;

  multiplier = 1;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.None;
}
