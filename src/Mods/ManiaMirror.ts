import { ManiaBeatmap } from '../Beatmaps/ManiaBeatmap';
import { IMod, IApplicableToBeatmap, ModBitwise, ModType } from 'osu-classes';

export class ManiaMirror implements IMod, IApplicableToBeatmap {
  name = 'Mirror';

  acronym = 'MR';

  bitwise: ModBitwise = ModBitwise.Mirror;

  type: ModType = ModType.Conversion;

  multiplier = 1;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.None;

  applyToBeatmap(beatmap: ManiaBeatmap): void {
    beatmap.hitObjects.forEach((h) => {
      h.column = beatmap.totalColumns - 1 - h.column;
    });
  }
}
