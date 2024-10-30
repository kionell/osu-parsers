import {
  BeatmapDifficultySection,
  MathUtils,
} from 'osu-classes';

/**
 * A dummy playfield UI class to store all required methods and properties.
 */
export class CatchPlayfield {
  /**
   * The size of the catcher at 1x scale.
   */
  static BASE_CATCHER_SIZE = 106.75;

  /**
   * The width of the catcher which can receive fruit. 
   * Equivalent to "catchMargin" in osu-stable.
   */
  static ALLOWED_CATCH_RANGE = Math.fround(0.8);

  static PLAYFIELD_WIDTH = 512;

  static calculateCatcherWidth(difficulty: BeatmapDifficultySection): number {
    let scale = Math.fround(
      Math.fround(0.7) * Math.fround(difficulty.circleSize - 5),
    );

    scale = Math.fround(1 - Math.fround(scale / 5));

    const catcherWidth = Math.fround(this.BASE_CATCHER_SIZE * Math.abs(scale));

    return Math.fround(catcherWidth * this.ALLOWED_CATCH_RANGE);
  }

  static clampToPlayfield(value: number): number {
    return MathUtils.clamp(value, 0, this.PLAYFIELD_WIDTH);
  }
}
