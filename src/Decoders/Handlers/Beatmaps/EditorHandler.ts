import { Beatmap } from 'osu-classes';

/**
 * A decoder for beatmap editor settings.
 */
export abstract class EditorHandler {
  /**
   * Decodes beatmap editor line and adds editor settings data to a beatmap.
   * @param line Editor section line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'Bookmarks':
        beatmap.editor.bookmarks = value.split(',').map((v) => +v);
        break;

      case 'DistanceSpacing':
        beatmap.editor.distanceSpacing = +value;
        break;

      case 'BeatDivisor':
        beatmap.editor.beatDivisor = +value;
        break;

      case 'GridSize':
        beatmap.editor.gridSize = +value;
        break;

      case 'TimelineZoom':
        beatmap.editor.timelineZoom = +value;
    }
  }
}
