import { ModBitwise } from 'osu-resources';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey2 extends ManiaKeyMod {
  name = 'Two Keys';

  acronym = '2K';

  bitwise: ModBitwise = ModBitwise.Key2;

  keyCount = 2;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key2;
}
