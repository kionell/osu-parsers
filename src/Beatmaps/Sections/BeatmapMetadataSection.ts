/**
 * A beatmap metadata section.
 */
export class BeatmapMetadataSection {
  /**
   * Romanised song title.
   */
  title = 'Unknown Title';

  /**
   * Song title.
   */
  titleUnicode = 'Unknown Title';

  /**
   * Romanised song artist.
   */
  artist = 'Unknown Artist';

  /**
   * Song artist.
   */
  artistUnicode = 'Unknown Artist';

  /**
   * Beatmap creator.
   */
  creator = 'Unknown Creator';

  /**
   * Difficulty name.
   */
  version = 'Normal';

  /**
   * Original media the song was produced for.
   */
  source = '';

  /**
   * Search terms.
   */
  tags: string[] = [];

  /**
   * Beatmap ID.
   */
  beatmapId = 0;

  /**
   * Beatmapset ID.
   */
  beatmapSetId = 0;

  /**
   * Creates a copy of this beatmap metadata section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapMetadataSection {
    const cloned = new BeatmapMetadataSection();

    cloned.title = this.title;
    cloned.titleUnicode = this.titleUnicode;
    cloned.artist = this.artist;
    cloned.artistUnicode = this.artistUnicode;
    cloned.creator = this.creator;
    cloned.version = this.version;
    cloned.source = this.source;

    cloned.tags = this.tags.slice();

    cloned.beatmapId = this.beatmapId;
    cloned.beatmapSetId = this.beatmapSetId;

    return cloned;
  }
}
