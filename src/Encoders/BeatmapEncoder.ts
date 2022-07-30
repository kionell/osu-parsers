import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { IBeatmap } from 'osu-classes';

import {
  BeatmapGeneralEncoder,
  BeatmapEditorEncoder,
  BeatmapMetadataEncoder,
  BeatmapDifficultyEncoder,
  BeatmapEventEncoder,
  BeatmapTimingPointEncoder,
  BeatmapColorEncoder,
  BeatmapHitObjectEncoder,
} from './Handlers';

/**
 * Beatmap encoder.
 */
export class BeatmapEncoder {
  /**
   * First playable lazer version.
   */
  static readonly FIRST_LAZER_VERSION = 128;

  /**
   * Performs beatmap encoding to the specified path.
   * @param path Path for writing the .osu file.
   * @param beatmap Beatmap for encoding.
   */
  encodeToPath(path: string, beatmap?: IBeatmap): void {
    if (!path.endsWith('.osu')) {
      path += '.osu';
    }

    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, this.encodeToString(beatmap));
  }

  /**
   * Performs beatmap encoding to a string.
   * @param beatmap Beatmap for encoding.
   * @returns A string with encoded beatmap data.
   */
  encodeToString(beatmap?: IBeatmap): string {
    if (!beatmap?.fileFormat) return '';

    const encoded: string[] = [];
    const fileFormat = beatmap.fileFormat ?? BeatmapEncoder.FIRST_LAZER_VERSION;

    encoded.push(`osu file format v${fileFormat}`);

    encoded.push(BeatmapGeneralEncoder.encodeGeneralSection(beatmap));
    encoded.push(BeatmapEditorEncoder.encodeEditorSection(beatmap));
    encoded.push(BeatmapMetadataEncoder.encodeMetadataSection(beatmap));
    encoded.push(BeatmapDifficultyEncoder.encodeDifficultySection(beatmap));
    encoded.push(BeatmapEventEncoder.encodeEventSection(beatmap));
    encoded.push(BeatmapTimingPointEncoder.encodeControlPoints(beatmap));
    encoded.push(BeatmapColorEncoder.encodeColors(beatmap));
    encoded.push(BeatmapHitObjectEncoder.encodeHitObjects(beatmap));

    return encoded.filter((x) => x).join('\n\n');
  }
}
