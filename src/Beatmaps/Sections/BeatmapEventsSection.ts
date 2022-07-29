import { Storyboard } from '../../Storyboards/Storyboard';
import { BeatmapBreakEvent } from '../Events/BeatmapBreakEvent';
import type { BeatmapEventSection } from './BeatmapEventSection';

/**
 * A legacy beatmap events section class.
 * Use the {@link BeatmapEventSection} instead.
 * @deprecated Since 0.10.0
 */
export class BeatmapEventsSection {
  /**
   * A beatmap background file path.
   * Use the {@link BeatmapEventSection.backgroundPath|backgroundPath} property instead.
   * @deprecated Since 0.10.0
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
  storyboard?: Storyboard | null;

  /**
   * Builds an instance of a legacy beatmap events section.
   * @param events Beatmap events section of new format.
   * @constructor
   */
  constructor(events?: BeatmapEventSection) {
    if (events?.background) {
      this.background = events.background;
    }

    if (events?.breaks) {
      this.breaks = events.breaks;
    }

    if (events?.storyboard) {
      this.storyboard = events.storyboard;
    }
  }

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
