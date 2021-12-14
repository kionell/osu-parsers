import { Flashlight, ModBitwise } from 'osu-classes';

export class ManiaFlashlight extends Flashlight {
  multiplier = 1;

  incompatibles: ModBitwise = ModBitwise.Hidden | ModBitwise.FadeIn;
}
