import { LayerType } from '../../Storyboards';
import { Storyboard } from '../../Storyboards/Storyboard';
import { BeatmapBreakEvent } from '../Events';

/**
 * A beatmap events section.
 */
export class BeatmapEventSection {
  /**
   * A beatmap background file path.
   */
  backgroundPath: string | null = null;

  /**
   * List of beatmap break events.
   */
  breaks: BeatmapBreakEvent[] = [];

  /**
   * A beatmap storyboard.
   */
  storyboard: Storyboard | null = null;

  /**
   * Whether the storyboard replace the background?
   */
  get isBackgroundReplaced(): boolean {
    if (!this.backgroundPath || !this.storyboard) return false;

    /**
     * I don't actually know if this reliable or not.
     */
    const filePath = this.backgroundPath.trim().toLowerCase();
    const layer = this.storyboard.getLayerByType(LayerType.Background);

    return !!layer.elements.find((e) => e.filePath.toLowerCase() === filePath);
  }

  /**
   * Creates a copy of this beatmap events section.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): BeatmapEventSection {
    const cloned = new BeatmapEventSection();

    cloned.backgroundPath = this.backgroundPath;
    cloned.breaks = this.breaks;
    cloned.storyboard = this.storyboard;

    return cloned;
  }
}
