import { IBeatmap } from 'osu-classes';
import { FileFormat } from '../Enums';
import { mkdir, writeFile, dirname } from '../Utils/FileSystem';

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
 * A beatmap encoder.
 */
export class BeatmapEncoder {
  /**
   * First playable lazer version.
   */
  static readonly FIRST_LAZER_VERSION = 128;

  /**
   * Performs beatmap encoding to the specified path.
   * @param path The path for writing the .osu file.
   * @param beatmap The beatmap for encoding.
   * @throws If beatmap can't be encoded or file can't be written.
   */
  async encodeToPath(path: string, beatmap?: IBeatmap): Promise<void> {
    if (!path.endsWith(FileFormat.Beatmap)) {
      path += FileFormat.Beatmap;
    }

    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, await this.encodeToString(beatmap));
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to encode a beatmap: ${reason}`);
    }
  }

  /**
   * Performs beatmap encoding to a string.
   * @param beatmap The beatmap for encoding.
   * @returns The string with encoded beatmap data.
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
