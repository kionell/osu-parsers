import { StandardHitObject } from './StandardHitObject';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
  NestedType,
  INestedHitObject,
} from 'osu-resources';

export class SliderTick extends StandardHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.Tick;

  spanIndex = 0;

  spanStartTime = 0;

  progress = 0;

  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    super.applyDefaultsToSelf(controlPoints, difficulty);

    /**
     * Adding 200 to include the offset stable used.
     * This is so on repeats ticks don't appear too late
     * to be visually processed by the player.
     */
    const offset = this.spanIndex > 0 ? 200 : this.timeFadeIn * Math.fround(0.66);

    this.timePreempt = (this.startTime - this.spanStartTime) / 2 + offset;
  }
}
