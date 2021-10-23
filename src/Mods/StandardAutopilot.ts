import {
  IMod,
  ModBitwise,
  ModType,
} from 'osu-resources';

export class StandardAutopilot implements IMod {
  name = 'Autopilot';

  acronym = 'AP';

  bitwise: ModBitwise = ModBitwise.Relax2;

  type: ModType = ModType.Automation;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.SpunOut | ModBitwise.NoFail | ModBitwise.Relax | ModBitwise.Autoplay;
}
