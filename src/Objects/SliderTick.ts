import { StandardHitObject } from './StandardHitObject';

import {
  ControlPointInfo,
  BeatmapDifficultySection,
} from 'osu-resources';

export class SliderTick extends StandardHitObject {
  spanIndex = 0;

  spanStartTime = 0;

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

  clone(): SliderTick {
    const cloned = new SliderTick();

    cloned.spanIndex = this.spanIndex;
    cloned.spanStartTime = this.spanStartTime;
    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.stackHeight = this.stackHeight;
    cloned.scale = this.scale;

    return cloned;
  }
}
