import { ModBitwise } from 'osu-resources';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey4 extends ManiaKeyMod {
  name = 'Four Keys';

  acronym = '4K';

  bitwise: ModBitwise = ModBitwise.Key4;

  keyCount = 4;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key4;
}
