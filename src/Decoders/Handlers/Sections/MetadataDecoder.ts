import { Beatmap } from 'osu-classes';
import { Parsing } from '../../../Utils';

/**
 * A decoder for beatmap metadata.
 */
export abstract class MetadataDecoder {
  /**
   * Decodes beatmap metadata line and adds metadata to a beatmap.
   * @param line Metadata section line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'Title':
        beatmap.metadata.title = value;
        break;

      case 'TitleUnicode':
        beatmap.metadata.titleUnicode = value;
        break;

      case 'Artist':
        beatmap.metadata.artist = value;
        break;

      case 'ArtistUnicode':
        beatmap.metadata.artistUnicode = value;
        break;

      case 'Creator':
        beatmap.metadata.creator = value;
        break;

      case 'Version':
        beatmap.metadata.version = value;
        break;

      case 'Source':
        beatmap.metadata.source = value;
        break;

      case 'Tags':
        beatmap.metadata.tags = value.split(' ');
        break;

      case 'BeatmapID':
        beatmap.metadata.beatmapId = Parsing.parseInt(value);
        break;

      case 'BeatmapSetID':
        beatmap.metadata.beatmapSetId = Parsing.parseInt(value);
    }
  }
}
