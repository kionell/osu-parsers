import { Autoplay, ModBitwise } from 'osu-resources';

export class StandardAutoplay extends Autoplay {
  incompatibles: ModBitwise = ModBitwise.Relax2 | ModBitwise.SpunOut;
}
