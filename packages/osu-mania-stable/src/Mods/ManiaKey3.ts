import { ModBitwise } from 'osu-classes';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey3 extends ManiaKeyMod {
  name = 'Three Keys';

  acronym = '3K';

  bitwise: ModBitwise = ModBitwise.Key3;

  keyCount = 3;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key3;
}
