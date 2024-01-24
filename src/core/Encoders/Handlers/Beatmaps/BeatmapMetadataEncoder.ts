import { IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap metadata section.
 */
export abstract class BeatmapMetadataEncoder {
  /**
   * Encodes beatmap metadata section.
   * @param beatmap A beatmap.
   * @returns Encoded beatmap metadata section.
   */
  static encodeMetadataSection(beatmap: IBeatmap): string {
    const encoded: string[] = ['[Metadata]'];

    const metadata = beatmap.metadata;

    encoded.push(`Title:${metadata.title}`);

    if (metadata.titleUnicode) {
      encoded.push(`TitleUnicode:${metadata.titleUnicode}`);
    }

    encoded.push(`Artist:${metadata.artist}`);

    if (metadata.artistUnicode) {
      encoded.push(`ArtistUnicode:${metadata.artistUnicode}`);
    }

    encoded.push(`Creator:${metadata.creator}`);
    encoded.push(`Version:${metadata.version}`);

    if (metadata.source) {
      encoded.push(`Source:${metadata.source}`);
    }

    if (metadata.tags.length > 0) {
      encoded.push(`Tags:${metadata.tags.join(' ')}`);
    }

    encoded.push(`BeatmapID:${metadata.beatmapId}`);
    encoded.push(`BeatmapSetID:${metadata.beatmapSetId}`);

    return encoded.join('\n');
  }
}
