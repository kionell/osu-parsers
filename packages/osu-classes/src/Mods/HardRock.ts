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
    const ratio = Math.fround(1.4);

    // CS uses custom ratio.
    const circleSize = Math.fround(difficulty.circleSize * Math.fround(1.3));
    const approachRate = Math.fround(difficulty.approachRate * ratio);
    const drainRate = Math.fround(difficulty.drainRate * ratio);
    const overallDifficulty = Math.fround(difficulty.overallDifficulty * ratio);

    difficulty.circleSize = Math.min(circleSize, 10);
    difficulty.approachRate = Math.min(approachRate, 10);
    difficulty.drainRate = Math.min(drainRate, 10);
    difficulty.overallDifficulty = Math.min(overallDifficulty, 10);
  }
}
