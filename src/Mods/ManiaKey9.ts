import { ModBitwise } from 'osu-classes';
import { ManiaKeyMod } from './ManiaKeyMod';

export class ManiaKey9 extends ManiaKeyMod {
  name = 'Nine Keys';

  acronym = '9K';

  bitwise: ModBitwise = ModBitwise.Key9;

  keyCount = 9;

  incompatibles = ModBitwise.KeyMod ^ ModBitwise.Key9;
}
