import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Hidden implements IMod {
  name = 'Hidden';

  acronym = 'HD';

  bitwise: ModBitwise = ModBitwise.Hidden;

  type: ModType = ModType.DifficultyIncrease;

  multiplier = 1.06;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.None;
}
