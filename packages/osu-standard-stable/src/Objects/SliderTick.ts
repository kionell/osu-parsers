import {
  ControlPointInfo,
  BeatmapDifficultySection,
} from 'osu-classes';

import { StandardHitObject } from './StandardHitObject';
import { StandardHitWindows } from '../Scoring';

export class SliderTick extends StandardHitObject {
  spanIndex = 0;

  spanStartTime = 0;

  hitWindows = StandardHitWindows.empty;

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    /**
     * Adding 200 to include the offset stable used.
     * This is so on repeats ticks don't appear too late
     * to be visually processed by the player.
     */
    const offset = this.spanIndex > 0 ? 200 : this.timePreempt * Math.fround(0.66);

    this.timePreempt = (this.startTime - this.spanStartTime) / 2 + offset;
  }

  /**
   * Creates a deep copy of this slider tick.
   * @returns Cloned slider tick.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.spanIndex = this.spanIndex;
    cloned.spanStartTime = this.spanStartTime;

    return cloned;
  }
}
