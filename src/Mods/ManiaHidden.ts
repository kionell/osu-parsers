import { Hidden, ModBitwise } from 'osu-resources';

export class ManiaHidden extends Hidden {
  multiplier = 1;

  incompatibles: ModBitwise = ModBitwise.FadeIn | ModBitwise.Flashlight;
}
