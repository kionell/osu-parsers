import { BeatmapDifficultySection } from '../Beatmaps/Sections/BeatmapDifficultySection';

import { IMod } from './IMod';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class DoubleTime implements IMod, IApplicableToDifficulty {
  name = 'Double Time';

  acronym = 'DT';

  bitwise: ModBitwise = ModBitwise.DoubleTime;

  type: ModType = ModType.DifficultyIncrease;

  multiplier = 1.12;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.HalfTime | ModBitwise.Nightcore;

  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    difficulty.clockRate = 1.5;
  }
}
