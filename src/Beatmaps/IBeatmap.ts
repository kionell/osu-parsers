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
   * Beatmap original game mode.
   */
  originalMode: number;

  /**
   * Beatmap file version.
   */
  fileFormat: number;

  /**
   * Beatmap length in milliseconds.
   */
  length: number;

  /**
   * Minimal BPM of a beatmap.
   */
  bpmMin: number;

  /**
   * Maximal BPM of a beatmap.
   */
  bpmMax: number;

  /**
   * The most common BPM of a beatmap.
   */
  bpmMode: number;

  /**
   * The total break time of a beatmap.
   */
  totalBreakTime: number;

  /**
   * Create a new copy of beatmap. 
   * @returns A clone of beatmap.
   */
  clone(): IBeatmap;
}
