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
    encoded.push(`TitleUnicode:${metadata.titleUnicode}`);
    encoded.push(`Artist:${metadata.artist}`);
    encoded.push(`ArtistUnicode:${metadata.artistUnicode}`);
    encoded.push(`Creator:${metadata.creator}`);
    encoded.push(`Version:${metadata.version}`);
    encoded.push(`Source:${metadata.source}`);
    encoded.push(`Tags:${metadata.tags.join(' ')}`);
    encoded.push(`BeatmapID:${metadata.beatmapId}`);
    encoded.push(`BeatmapSetID:${metadata.beatmapSetId}`);

    return encoded.join('\n');
  }
}
