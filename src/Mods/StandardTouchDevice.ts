import { IMod, ModBitwise, ModType } from 'osu-resources';

export class StandardTouchDevice implements IMod {
  name = 'Touch Device';

  acronym = 'TD';

  bitwise: ModBitwise = ModBitwise.TouchDevice;

  type: ModType = ModType.System;

  multiplier = 1;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.None;
}
