import { DoubleTime } from './DoubleTime';

import { ModBitwise } from './Enums/ModBitwise';

export abstract class Nightcore extends DoubleTime {
  name = 'Nightcore';

  acronym = 'NC';

  bitwise: ModBitwise = ModBitwise.Nightcore;

  incompatibles: ModBitwise = ModBitwise.DoubleTime;
}
