import { writeFileSync } from 'fs';

import { IBeatmap } from 'osu-classes';

import {
  GeneralEncoder,
  EditorEncoder,
  MetadataEncoder,
  DifficultyEncoder,
  EventsEncoder,
  TimingPointEncoder,
  ColourEncoder,
  HitObjectEncoder,
} from './Handlers';

/**
 * Beatmap encoder.
 */
export class BeatmapEncoder {
  /**
   * Performs beatmap encoding to the specified path.
   * @param path Path for writing the .osu file.
   * @param beatmap Beatmap for encoding.
   */
  encodeToPath(path: string, beatmap: IBeatmap): void {
    if (!path.endsWith('.osu')) {
      path += '.osu';
    }

    writeFileSync(path, this.encodeToString(beatmap));
  }

  /**
   * Performs beatmap encoding to a string.
   * @param beatmap Beatmap for encoding.
   * @returns A string with encoded beatmap data.
   */
  encodeToString(beatmap: IBeatmap): string {
    const encoded: string[] = [];

    if (beatmap.fileFormat) {
      encoded.push(`osu file format v${beatmap.fileFormat}`);

      encoded.push(GeneralEncoder.encodeGeneralSection(beatmap));
      encoded.push(EditorEncoder.encodeEditorSection(beatmap));
      encoded.push(MetadataEncoder.encodeMetadataSection(beatmap));
      encoded.push(DifficultyEncoder.encodeDifficultySection(beatmap));
      encoded.push(EventsEncoder.encodeEventsSection(beatmap));
      encoded.push(TimingPointEncoder.encodeControlPoints(beatmap));
      encoded.push(ColourEncoder.encodeColours(beatmap));
      encoded.push(HitObjectEncoder.encodeHitObjects(beatmap));
    }

    return encoded.filter((x) => x).join('\n\n');
  }
}
