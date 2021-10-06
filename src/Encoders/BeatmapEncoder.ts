import { IBeatmap } from 'osu-resources';

import { writeFileSync } from 'fs';

import { GeneralEncoder } from './PairSections/GeneralEncoder';
import { EditorEncoder } from './PairSections/EditorEncoder';
import { MetadataEncoder } from './PairSections/MetadataEncoder';
import { DifficultyEncoder } from './PairSections/DifficultyEncoder';
import { EventsEncoder } from './Events/EventsEncoder';
import { TimingPointEncoder } from './ListSections/TimingPointEncoder';
import { ColourEncoder } from './PairSections/ColourEncoder';
import { HitObjectEncoder } from './ListSections/HitObjectEncoder';

/**
 * Beatmap encoder.
 */
export abstract class BeatmapEncoder {
  /**
   * Performs beatmap encoding to the specified path.
   * @param path Path for writing the .osu file.
   * @param beatmap Beatmap for encoding.
   */
  static encodeToPath(path: string, beatmap: IBeatmap): void {
    if (!path.endsWith('.osu')) {
      path += '.osu';
    }

    writeFileSync(path, BeatmapEncoder.encodeToString(beatmap));
  }

  /**
   * Performs beatmap encoding to a string.
   * @param beatmap Beatmap for encoding.
   * @returns A string with encoded beatmap data.
   */
  static encodeToString(beatmap: IBeatmap): string {
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
