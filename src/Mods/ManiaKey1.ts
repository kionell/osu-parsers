import { ModBitwise } from 'osu-resources';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey1 extends ManiaKeyMod {
  name = 'One Key';

  acronym = '1K';

  bitwise: ModBitwise = ModBitwise.Key1;

  keyCount = 1;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key1;
}
