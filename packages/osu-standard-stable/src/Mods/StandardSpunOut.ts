﻿import { IMod, ModBitwise, ModType } from 'osu-classes';

export class StandardSpunOut implements IMod {
  name = 'Spun Out';

  acronym = 'SO';

  bitwise: ModBitwise = ModBitwise.SpunOut;

  type: ModType = ModType.Automation;

  multiplier = 0.9;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.Autoplay |
    ModBitwise.Cinema |
    ModBitwise.Relax2;
}
