import { Storyboard } from '../../Storyboards/Storyboard';
import { BeatmapBreakEvent } from '../Events/BeatmapBreakEvent';

/**
 * A beatmap events section.
 */
export class BeatmapEventSection {
  /**
   * A beatmap background file path.
   */
  background: string | null = null;

  /**
   * A beatmap video file path.
   */
  video: string | null = null;

  /**
   * Video offset in milliseconds.
   */
  videoOffset = 0;

  /**
   * List of beatmap break events.
   */
  breaks: BeatmapBreakEvent[] = [];

  /**
   * A beatmap storyboard.
   */
  storyboard: Storyboard | null = null;

  /**
   * Creates a copy of this beatmap events section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapEventSection {
    const cloned = new BeatmapEventSection();

    cloned.background = this.background;
    cloned.video = this.video;
    cloned.videoOffset = this.videoOffset;
    cloned.breaks = this.breaks;
    cloned.storyboard = this.storyboard;

    return cloned;
  }
}
