import { mkdirSync, writeFileSync } from '../Utils/FileSystem';
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

    const fileFormat = beatmap.fileFormat ?? BeatmapEncoder.FIRST_LAZER_VERSION;

    const encoded: string[] = [
      `osu file format v${fileFormat}`,

      BeatmapGeneralEncoder.encodeGeneralSection(beatmap),
      BeatmapEditorEncoder.encodeEditorSection(beatmap),
      BeatmapMetadataEncoder.encodeMetadataSection(beatmap),
      BeatmapDifficultyEncoder.encodeDifficultySection(beatmap),
      BeatmapEventEncoder.encodeEventSection(beatmap),
      BeatmapTimingPointEncoder.encodeControlPoints(beatmap),
      BeatmapColorEncoder.encodeColors(beatmap),
      BeatmapHitObjectEncoder.encodeHitObjects(beatmap),
    ];

    return encoded.join('\n\n') + '\n';
  }
}
