import { ModBitwise } from 'osu-classes';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey8 extends ManiaKeyMod {
  name = 'Eight Keys';

  acronym = '8K';

  bitwise: ModBitwise = ModBitwise.Key8;

  keyCount = 8;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key8;
}
