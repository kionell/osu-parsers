/**
 * A beatmap editor section.
 */
export class BeatmapEditorSection {
  /**
   * Time in milliseconds of bookmarks.
   */
  bookmarks: number[] = [];

  /**
   * Distance snap multiplier.
   */
  distanceSpacing = 1;

  /**
   * Beat snap divisor.
   */
  beatDivisor = 4;

  /**
   * Grid size.
   */
  gridSize = 1;

  /**
   * Scale factor for the object timeline.
   */
  timelineZoom = 2;

  /**
   * Creates a copy of this beatmap editor section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapEditorSection {
    const cloned = new BeatmapEditorSection();

    cloned.bookmarks = this.bookmarks.slice();
    cloned.distanceSpacing = this.distanceSpacing;
    cloned.beatDivisor = this.beatDivisor;
    cloned.gridSize = this.gridSize;
    cloned.timelineZoom = this.timelineZoom;

    return cloned;
  }
}
