import { ManiaBeatmapConverter } from '../Beatmaps/ManiaBeatmapConverter';
import { IMod, IApplicableToConverter, ModBitwise, ModType } from 'osu-resources';

export abstract class ManiaKeyMod implements IMod, IApplicableToConverter {
  abstract name: string;

  abstract acronym: string;

  abstract bitwise: ModBitwise;

  abstract keyCount: number;

  type: ModType = ModType.Conversion;

  multiplier = 1;

  isRanked = true;

  incompatibles = ModBitwise.KeyMod;

  applyToConverter(converter: ManiaBeatmapConverter): void {
    converter.targetColumns = this.keyCount;
  }
}
