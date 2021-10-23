import { ManiaBeatmapConverter } from '../Beatmaps/ManiaBeatmapConverter';
import { IMod, IApplicableToConverter, ModBitwise, ModType } from 'osu-resources';

export class ManiaDualStages implements IMod, IApplicableToConverter {
  name = 'Dual Stages';

  acronym = 'DS';

  bitwise: ModBitwise = ModBitwise.KeyCoop;

  type: ModType = ModType.Conversion;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.None;

  applyToConverter(converter: ManiaBeatmapConverter): void {
    converter.isDual = true;
  }
}
