import { ManiaBeatmap } from '../Beatmaps/ManiaBeatmap';
import { IMod, IApplicableToBeatmap, ModBitwise, ModType } from 'osu-classes';

export class ManiaRandom implements IMod, IApplicableToBeatmap {
  name = 'Random';

  acronym = 'RD';

  bitwise: ModBitwise = ModBitwise.Random;

  type: ModType = ModType.Conversion;

  multiplier = 1;

  isRanked = false;

  incompatibles: ModBitwise = ModBitwise.None;

  applyToBeatmap(beatmap: ManiaBeatmap): void {
    const random: number[] = [];
    const shuffled: number[] = [];

    for (let i = 0; i < beatmap.totalColumns; ++i) {
      random.push(Math.random());
      shuffled.push(i);
    }

    shuffled.sort((a, b) => random[shuffled.indexOf(a)] - random[shuffled.indexOf(b)]);

    beatmap.hitObjects.forEach((h) => (h.column = shuffled[h.column]));
  }
}
