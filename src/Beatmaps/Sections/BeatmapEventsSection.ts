import { Storyboard } from '../../Storyboards/Storyboard';
import { BeatmapBreakEvent } from '../Events/BeatmapBreakEvent';

/**
 * A beatmap events section.
 */
export class BeatmapEventsSection {
  /**
   * A beatmap background file path.
   */
  background?: string;

  /**
   * A beatmap video file path.
   */
  video?: string;

  /**
   * Video offset in milliseconds.
   */
  videoOffset?: number;

  /**
   * List of beatmap break events.
   */
  breaks?: BeatmapBreakEvent[];

  /**
   * A beatmap storyboard.
   */
  storyboard?: Storyboard;

  /**
   * Creates a copy of this beatmap events section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapEventsSection {
    const cloned = new BeatmapEventsSection();

    if (this.background) {
      cloned.background = this.background;
    }

    if (this.video) {
      cloned.video = this.video;
    }

    if (this.videoOffset) {
      cloned.videoOffset = this.videoOffset;
    }

    if (this.breaks) {
      cloned.breaks = this.breaks;
    }

    if (this.storyboard) {
      cloned.storyboard = this.storyboard;
    }

    return cloned;
  }
}
