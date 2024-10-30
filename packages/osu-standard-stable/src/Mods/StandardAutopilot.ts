import {
  IMod,
  ModBitwise,
  ModType,
} from 'osu-classes';

export class StandardAutopilot implements IMod {
  name = 'Autopilot';

  acronym = 'AP';

  bitwise: ModBitwise = ModBitwise.Relax2;

  type: ModType = ModType.Automation;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.NoFail |
    ModBitwise.SuddenDeath |
    ModBitwise.Perfect |
    ModBitwise.Autoplay |
    ModBitwise.Cinema |
    ModBitwise.Relax |
    ModBitwise.SpunOut;
}
