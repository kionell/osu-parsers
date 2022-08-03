import { BeatmapColorSection, BeatmapColoursSection } from 'osu-classes';

/**
 * A parsable object that has information about custom beatmap colors.
 */
export interface IHasBeatmapColors {
  /**
   * Custom beatmap colors.
   */
  colors: BeatmapColorSection;

  /**
   * Legacy beatmap colours section.
   */
  colours?: BeatmapColoursSection;
}
