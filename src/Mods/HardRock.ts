import { BeatmapDifficultySection } from '../Beatmaps/Sections/BeatmapDifficultySection';

import { IMod } from './IMod';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';

import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export abstract class HardRock implements IMod, IApplicableToDifficulty {
  name = 'Hard Rock';

  acronym = 'HR';

  bitwise: ModBitwise = ModBitwise.HardRock;

  type: ModType = ModType.DifficultyIncrease;

  multiplier = 1.06;

  isRanked = true;

  incompatibles: ModBitwise = ModBitwise.Easy;

  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    difficulty.circleSize = Math.min(difficulty.circleSize * 1.3, 10);
    difficulty.approachRate = Math.min(difficulty.approachRate * 1.4, 10);
    difficulty.drainRate = Math.min(difficulty.drainRate * 1.4, 10);
    difficulty.overallDifficulty = Math.min(difficulty.overallDifficulty * 1.4,
      10);
  }
}
