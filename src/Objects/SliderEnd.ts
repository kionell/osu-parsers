import { Circle } from './Circle';
import { Slider } from './Slider';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
} from 'osu-classes';
import { StandardHitWindows } from '../Scoring';

export abstract class SliderEnd extends Circle {
  protected _slider: Slider;

  repeatIndex = 0;

  hitWindows = StandardHitWindows.empty;

  constructor(slider: Slider) {
    super();
    this._slider = slider;
  }

  get spanDuration(): number {
    return this._slider.spanDuration;
  }

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    if (this.repeatIndex > 0) {
      /**
       * Repeat points after the first span
       * should appear behind the still-visible one.
       */
      this.timeFadeIn = 0;

      /**
       * The next end circle should appear exactly
       * after the previous circle (on the same end) is hit.
       */
      this.timePreempt = this.spanDuration * 2;

      return;
    }

    /**
     * Taken from osu-stable.
     */
    const FIRST_END_CIRCLE_PREEMPT_ADJUST = Math.fround(2 / 3);

    /**
     * The first end circle should fade in with the slider.
     */
    this.timePreempt = this.startTime - this._slider.startTime
      + this._slider.timePreempt * FIRST_END_CIRCLE_PREEMPT_ADJUST;
  }
}
