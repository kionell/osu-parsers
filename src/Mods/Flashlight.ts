import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Flashlight implements IMod {
  name = 'Flashlight';

  acronym = 'FL';

  bitwise: ModBitwise = ModBitwise.Flashlight;

  type: ModType = ModType.DifficultyIncrease;

  multiplier = 1.12;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.None;
}
