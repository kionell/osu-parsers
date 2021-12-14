import { ModBitwise } from 'osu-classes';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey5 extends ManiaKeyMod {
  name = 'Five Keys';

  acronym = '5K';

  bitwise: ModBitwise = ModBitwise.Key5;

  keyCount = 5;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key5;
}
