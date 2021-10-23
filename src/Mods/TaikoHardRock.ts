import { HardRock, BeatmapDifficultySection } from 'osu-resources';

export class TaikoHardRock extends HardRock {
  applyToDifficulty(difficulty: BeatmapDifficultySection): void {
    super.applyToDifficulty(difficulty);

    /**
     * Multiplier factor added to the scrolling speed.
     * This factor is made up of two parts:
     *  - the base part (1.4)
     *  - the aspect ratio adjustment (4/3).
     *
     * Stable applies the latter by dividing the width of the user's display
     * by the width of a display with the same height, but 4:3 aspect ratio.
     */
    difficulty.sliderMultiplier *= (1.4 * 4 / 3);
  }
}
