/**
 * A beatmap metadata section.
 */
export class BeatmapMetadataSection {
  /**
   * Romanised song title.
   */
  title = 'Unknown Title';

  /**
   * Romanised song artist.
   */
  artist = 'Unknown Artist';

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
   * Song title.
   */
  private _titleUnicode = 'Unknown Title';

  get titleUnicode(): string {
    return this._titleUnicode !== 'Unknown Title'
      ? this._titleUnicode : this.title;
  }

  set titleUnicode(value: string) {
    this._titleUnicode = value;
  }

  /**
   * Song artist.
   */
  private _artistUnicode = 'Unknown Artist';

  get artistUnicode(): string {
    return this._artistUnicode !== 'Unknown Artist'
      ? this._artistUnicode : this.artist;
  }

  set artistUnicode(value: string) {
    this._artistUnicode = value;
  }

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
