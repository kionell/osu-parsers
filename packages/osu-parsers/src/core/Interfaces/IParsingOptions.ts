export interface IParsingOptions {
  /**
   * Whether to parse colour section or not.
   * This section is only required for beatmap & storyboard rendering stuff
   * and doesn't affect beatmap parsing and difficulty & performance calculation at all.
   */
  parseColours?: boolean;
}

export interface IBeatmapParsingOptions extends IParsingOptions {
  /**
   * Whether to parse general section or not.
   * This section contains very important data like beatmap mode or file format 
   * and should not be omitted unless you really need to. Different beatmap file formats
   * can significantly affect beatmap parsing and difficulty & performance calculations.
   */
  parseGeneral?: boolean;

  /**
   * Whether to parse editor section or not.
   * This section isn't required anywhere so it can be disabled safely.
   */
  parseEditor?: boolean;

  /**
   * Whether to parse metadata section or not.
   * This section isn't required anywhere so it can be disabled safely.
   */
  parseMetadata?: boolean;

  /**
   * Whether to parse difficulty section or not.
   * This section is required for hit object processing and difficulty & performance calculations.
   */
  parseDifficulty?: boolean;

  /**
   * Whether to parse events section or not.
   * Events section contains information about breaks, background and storyboard.
   * Changing this will also affects storyboard parsing.
   */
  parseEvents?: boolean;

  /**
   * Whether to parse timing point section or not.
   * Timing points are required for internal hit object processing.
   */
  parseTimingPoints?: boolean;

  /**
   * Whether to parse hit object section or not.
   * If you don't need hit objects you can safely disable this section.
   */
  parseHitObjects?: boolean;

  /**
   * Whether to parse storyboard or not.
   * If you don't need storyboard you can safely disable this section.
   */
  parseStoryboard?: boolean;
}
