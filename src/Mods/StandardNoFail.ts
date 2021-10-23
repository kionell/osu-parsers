import { NoFail, ModBitwise } from 'osu-resources';

export class StandardNoFail extends NoFail {
  incompatibles: ModBitwise = ModBitwise.Relax2;
}
