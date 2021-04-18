import { BeatmapDifficultySection } from '../Beatmaps/Sections/BeatmapDifficultySection';

import { IMod } from './IMod';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class HalfTime implements IMod, IApplicableToDifficulty {
  name = 'Half Time';

  acronym = 'HT';

  bitwise: ModBitwise = ModBitwise.HalfTime;

  type: ModType = ModType.DifficultyReduction;

  multiplier = 0.3;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.DoubleTime;

  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    difficulty.clockRate = 0.75;
  }
}
