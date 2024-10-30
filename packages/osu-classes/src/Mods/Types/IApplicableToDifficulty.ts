import { BeatmapDifficultySection } from '../../Beatmaps/Sections/BeatmapDifficultySection';

import { IMod } from '../IMod';

/**
 * Mod that applicable to the beatmap.
 */
export interface IApplicableToDifficulty extends IMod {
  /**
   * Applies a mod to a beatmap difficulty.
   * @param difficulty A beatmap difficulty.
   */
  applyToDifficulty(difficulty: BeatmapDifficultySection): void;
}
