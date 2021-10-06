import {
  BeatmapGeneralSection,
  BeatmapEditorSection,
  BeatmapDifficultySection,
  BeatmapMetadataSection,
  BeatmapColoursSection,
  BeatmapEventsSection,
  ControlPointInfo,
  IBeatmap,
} from 'osu-resources';

import { ParsedHitObject } from './ParsedHitObject';

/**
 * A parsed beatmap.
 */
export class ParsedBeatmap implements IBeatmap {
  /**
   * Beatmap general info.
   */
  general: BeatmapGeneralSection = new BeatmapGeneralSection();

  /**
   * Beatmap editor settings.
   */
  editor: BeatmapEditorSection = new BeatmapEditorSection();

  /**
   * Beatmap difficulty.
   */
  difficulty: BeatmapDifficultySection = new BeatmapDifficultySection();

  /**
   * Beatmap metadata.
   */
  metadata: BeatmapMetadataSection = new BeatmapMetadataSection();

  /**
   * Beatmap skin configuration.
   */
  colours: BeatmapColoursSection = new BeatmapColoursSection();

  /**
   * Beatmap events & Storyboard.
   */
  events: BeatmapEventsSection = new BeatmapEventsSection();

  /**
   * Beatmap control points.
   */
  controlPoints: ControlPointInfo = new ControlPointInfo();

  /**
   * Beatmap hit objects.
   */
  hitObjects: ParsedHitObject[] = [];

  /**
   * Beatmap gamemode.
   */
  mode = 0;

  /**
   * Beatmap file version.
   */
  fileFormat = 14;

  /**
   * Creates a copy of this parsed beatmap.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied parsed beatmap.
   */
  clone(): ParsedBeatmap {
    const cloned = new ParsedBeatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();

    cloned.mode = this.mode;
    cloned.fileFormat = this.fileFormat;

    cloned.hitObjects = this.hitObjects.map((h) => h.clone());

    return cloned;
  }
}
