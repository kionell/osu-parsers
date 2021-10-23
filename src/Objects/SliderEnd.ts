import { Circle } from './Circle';
import { Slider } from './Slider';

import {
  IHitObject,
  ControlPointInfo,
  BeatmapDifficultySection,
} from 'osu-resources';

export abstract class SliderEnd extends Circle {
  private _slider: Slider;

  repeatIndex = 0;

  constructor(hitObject: IHitObject, slider: Slider) {
    super(hitObject);

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

    // The first end circle should fade in with the slider.
    this.timePreempt = this.startTime - this._slider.startTime
      + (this._slider.timePreempt * 2) / Math.fround(3);
  }
}
