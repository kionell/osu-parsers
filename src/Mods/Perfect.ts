import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Perfect implements IMod {
  name = 'Perfect';

  acronym = 'PF';

  bitwise: ModBitwise = ModBitwise.SuddenDeath;

  type: ModType = ModType.DifficultyIncrease;

  multiplier = 1;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.SuddenDeath;
}
