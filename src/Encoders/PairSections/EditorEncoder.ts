import { IBeatmap } from 'osu-resources';

/**
 * An encoder for beatmap editor settings.
 */
export abstract class EditorEncoder {
  /**
   * Encodes beatmap editor section.
   * @param beatmap A beatmap.
   * @returns Encoded beatmap editor section.
   */
  static encodeEditorSection(beatmap: IBeatmap): string {
    const encoded: string[] = ['[Editor]'];

    const editor = beatmap.editor;

    encoded.push(`Bookmarks:${editor.bookmarks.join(',')}`);
    encoded.push(`DistanceSpacing:${editor.distanceSpacing}`);
    encoded.push(`BeatDivisor:${editor.beatDivisor}`);
    encoded.push(`GridSize:${editor.gridSize}`);
    encoded.push(`TimelineZoom:${editor.timelineZoom}`);

    return encoded.join('\n');
  }
}
