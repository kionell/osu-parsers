import { ModBitwise } from 'osu-resources';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey7 extends ManiaKeyMod {
  name = 'Seven Keys';

  acronym = '7K';

  bitwise: ModBitwise = ModBitwise.Key7;

  keyCount = 7;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key7;
}
