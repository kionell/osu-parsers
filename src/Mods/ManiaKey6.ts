import { ModBitwise } from 'osu-classes';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey6 extends ManiaKeyMod {
  name = 'Six Keys';

  acronym = '6K';

  bitwise: ModBitwise = ModBitwise.Key6;

  keyCount = 6;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key6;
}
