import { IMod } from './IMod';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class NoFail implements IMod {
  name = 'No Fail';

  acronym = 'NF';

  bitwise: ModBitwise = ModBitwise.NoFail;

  type: ModType = ModType.DifficultyReduction;

  multiplier = 0.5;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.SuddenDeath |
    ModBitwise.Perfect |
    ModBitwise.Autoplay |
    ModBitwise.Cinema |
    ModBitwise.Relax |
    ModBitwise.Relax2;
}
