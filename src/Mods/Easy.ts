import { BeatmapDifficultySection } from '../Beatmaps/Sections/BeatmapDifficultySection';

import { IMod } from './IMod';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class Easy implements IMod, IApplicableToDifficulty {
  name = 'Easy';

  acronym = 'EZ';

  bitwise: ModBitwise = ModBitwise.Easy;

  type: ModType = ModType.DifficultyReduction;

  multiplier = 0.5;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.HardRock;

  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    difficulty.circleSize /= 2;
    difficulty.approachRate /= 2;
    difficulty.drainRate /= 2;
    difficulty.overallDifficulty /= 2;
  }
}
