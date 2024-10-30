import { Beatmap } from 'osu-classes';
import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for beatmap editor settings.
 */
export abstract class BeatmapEditorDecoder {
  /**
   * Decodes beatmap editor line and adds editor settings data to a beatmap.
   * @param line Editor section line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
    const [key, ...values] = line.split(':');
    const value = values.join(':').trim();

    switch (key.trim()) {
      case 'Bookmarks':
        beatmap.editor.bookmarks = value.split(',').map((v) => +v);
        break;

      case 'DistanceSpacing':
        beatmap.editor.distanceSpacing = Math.max(0, Parsing.parseFloat(value));
        break;

      case 'BeatDivisor':
        beatmap.editor.beatDivisor = Parsing.parseInt(value);
        break;

      case 'GridSize':
        beatmap.editor.gridSize = Parsing.parseInt(value);
        break;

      case 'TimelineZoom':
        beatmap.editor.timelineZoom = Math.max(0, Parsing.parseFloat(value));
    }
  }
}
