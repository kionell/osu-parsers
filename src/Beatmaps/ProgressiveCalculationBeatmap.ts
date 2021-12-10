import { BeatmapGeneralSection } from './Sections/BeatmapGeneralSection';
import { BeatmapEditorSection } from './Sections/BeatmapEditorSection';
import { BeatmapDifficultySection } from './Sections/BeatmapDifficultySection';
import { BeatmapMetadataSection } from './Sections/BeatmapMetadataSection';
import { BeatmapColoursSection } from './Sections/BeatmapColoursSection';
import { BeatmapEventsSection } from './Sections/BeatmapEventsSection';
import { ControlPointInfo } from './ControlPoints/ControlPointInfo';
import { IBeatmap } from './IBeatmap';
import { IHitObject } from '../Objects/IHitObject';

/**
 * Used to calculate timed difficulty attributes, 
 * where only a subset of hitobjects should be visible at any point in time.
 */
export class ProgressiveCalculationBeatmap implements IBeatmap {
  private readonly _baseBeatmap: IBeatmap;

  constructor(baseBeatmap: IBeatmap) {
    this._baseBeatmap = baseBeatmap;
  }

  /**
   * Beatmap hit objects.
   */
  readonly hitObjects: IHitObject[] = [];

  /**
   * Beatmap general info.
   */
  get general(): BeatmapGeneralSection {
    return this._baseBeatmap.general;
  }

  set general(value: BeatmapGeneralSection) {
    this._baseBeatmap.general = value;
  }
  /**
   * Beatmap editor settings.
   */
  get editor(): BeatmapEditorSection {
    return this._baseBeatmap.editor;
  }

  set editor(value: BeatmapEditorSection) {
    this._baseBeatmap.editor = value;
  }

  /**
   * Beatmap difficulty.
   */
  get difficulty(): BeatmapDifficultySection {
    return this._baseBeatmap.difficulty;
  }

  set difficulty(value: BeatmapDifficultySection) {
    this._baseBeatmap.difficulty = value;
  }

  /**
   * Beatmap metadata.
   */
  get metadata(): BeatmapMetadataSection {
    return this._baseBeatmap.metadata;
  }

  set metadata(value: BeatmapMetadataSection) {
    this._baseBeatmap.metadata = value;
  }

  /**
   * Beatmap skin configuration.
   */
  get colours(): BeatmapColoursSection {
    return this._baseBeatmap.colours;
  }

  set colours(value: BeatmapColoursSection) {
    this._baseBeatmap.colours = value;
  }

  /**
   * Beatmap events & Storyboard.
   */
  get events(): BeatmapEventsSection {
    return this._baseBeatmap.events;
  }

  set events(value: BeatmapEventsSection) {
    this._baseBeatmap.events = value;
  }

  /**
   * Beatmap control points.
   */
  get controlPoints(): ControlPointInfo {
    return this._baseBeatmap.controlPoints;
  }

  set controlPoints(value: ControlPointInfo) {
    this._baseBeatmap.controlPoints = value;
  }

  /**
   * Beatmap gamemode.
   */
  get mode(): number {
    return this._baseBeatmap.mode;
  }

  /**
   * Beatmap file version.
   */
  get fileFormat(): number {
    return this._baseBeatmap.fileFormat;
  }

  /**
   * Beatmap length in milliseconds.
   */
  get length(): number {
    return this._baseBeatmap.length;
  }

  /**
   * Minimal BPM of a beatmap.
   */
  get bpmMin(): number {
    return this._baseBeatmap.bpmMin;
  }

  /**
   * Maximal BPM of a beatmap.
   */
  get bpmMax(): number {
    return this._baseBeatmap.bpmMax;
  }

  /**
   * The most common BPM of a beatmap.
   */
  get bpmMode(): number {
    return this._baseBeatmap.bpmMode;
  }

  /**
   * The total break time of a beatmap.
   */
  get totalBreakTime(): number {
    return this._baseBeatmap.totalBreakTime;
  }

  /**
   * Create a new copy of this beatmap. 
   * @returns A clone of this beatmap.
   */
  clone(): ProgressiveCalculationBeatmap {
    return new ProgressiveCalculationBeatmap(this._baseBeatmap);
  }
}
