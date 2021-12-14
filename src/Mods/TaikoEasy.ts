import { Easy, BeatmapDifficultySection } from 'osu-classes';

export class TaikoEasy extends Easy {
  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    super.applyToDifficulty(difficulty);

    // Multiplier factor added to the scrolling speed.
    difficulty.sliderMultiplier *= 0.8;
  }
}
