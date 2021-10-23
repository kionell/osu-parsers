import { BeatmapGeneralSection } from './Sections/BeatmapGeneralSection';
import { BeatmapEditorSection } from './Sections/BeatmapEditorSection';
import { BeatmapDifficultySection } from './Sections/BeatmapDifficultySection';
import { BeatmapMetadataSection } from './Sections/BeatmapMetadataSection';
import { BeatmapColoursSection } from './Sections/BeatmapColoursSection';
import { BeatmapEventsSection } from './Sections/BeatmapEventsSection';
import { ControlPointInfo } from './ControlPoints/ControlPointInfo';
import { IHitObject } from '../Objects/IHitObject';

/**
 * A beatmap.
 */
export interface IBeatmap {
  /**
   * Beatmap general info.
   */
  general: BeatmapGeneralSection;

  /**
   * Beatmap editor settings.
   */
  editor: BeatmapEditorSection;

  /**
   * Beatmap difficulty.
   */
  difficulty: BeatmapDifficultySection;

  /**
   * Beatmap metadata.
   */
  metadata: BeatmapMetadataSection;

  /**
   * Beatmap skin configuration.
   */
  colours: BeatmapColoursSection;

  /**
   * Beatmap events & storyboard.
   */
  events: BeatmapEventsSection;

  /**
   * Beatmap control points.
   */
  controlPoints: ControlPointInfo;

  /**
   * Beatmap hit objects.
   */
  hitObjects: IHitObject[];

  /**
   * Beatmap game mode.
   */
  mode: number;

  /**
   * Beatmap file version.
   */
  fileFormat: number;

  /**
   * Create a new copy of hit object base. 
   * @returns A clone of hit object base.
   */
  clone(): IBeatmap;
}
