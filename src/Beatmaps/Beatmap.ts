import {
  BeatmapGeneralSection,
  BeatmapEditorSection,
  BeatmapDifficultySection,
  BeatmapMetadataSection,
  BeatmapColoursSection,
  BeatmapEventsSection,
} from './Sections';

import { ControlPointInfo } from './ControlPoints';

import { IBeatmap } from './IBeatmap';
import { HitObject, IHasDuration } from '../Objects';
import { RoundHelper } from '../Utils';

/**
 * A parsed beatmap.
 */
export class Beatmap implements IBeatmap {
  /**
   * The optional link to the base beatmap.
   * Base beatmap prefered for beatmap convertation.
   */
  base?: IBeatmap;

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
  hitObjects: HitObject[] = [];

  /**
   * Beatmap file version.
   */
  fileFormat = 14;

  /**
   * The date when the beatmap file was updated last time.
   */
  fileUpdateDate: Date = new Date();

  /**
   * Beatmap original gamemode.
   */
  originalMode = 0;

  /**
   * Beatmap gamemode.
   */
  get mode(): number {
    return this.originalMode;
  }

  /**
   * Beatmap length in milliseconds.
   */
  get length(): number {
    if (!this.hitObjects.length) {
      return 0;
    }

    const first = this.hitObjects[0];
    const last = this.hitObjects[this.hitObjects.length - 1];

    const startTime = first.startTime;
    const endTime = (last as unknown as IHasDuration).endTime || last.startTime;

    return endTime - startTime;
  }

  /**
   * Minimal BPM of a beatmap.
   */
  get bpmMin(): number {
    const beats = this.controlPoints.timingPoints
      .map((t) => t.bpm)
      .filter((t) => t >= 0);

    if (beats.length) {
      return beats.reduce((bpm, beat) => Math.min(bpm, beat), Infinity);
    }

    return 60;
  }

  /**
   * Maximal BPM of a beatmap.
   */
  get bpmMax(): number {
    const beats = this.controlPoints.timingPoints
      .map((t) => t.bpm)
      .filter((t) => t >= 0);

    if (beats.length) {
      return beats.reduce((bpm, beat) => Math.max(bpm, beat), 0);
    }

    return 60;
  }

  /**
   * The most common BPM of a beatmap.
   */
  get bpmMode(): number {
    if (this.hitObjects.length === 0) {
      return this.bpmMax;
    }

    const hitObjects = this.hitObjects;
    const timingPoints = this.controlPoints.timingPoints;

    /**
     * The last playable time in the beatmap - the last timing point extends to this time.
     * Note: This is more accurate and may present different results because 
     * osu-stable didn't have the ability to calculate slider durations in this context.
     */
    const lastObj = hitObjects[hitObjects.length - 1];
    const durationObj = lastObj as unknown as IHasDuration;

    const lastTime = durationObj.endTime || lastObj.startTime || 0;
    let nextTime = 0;
    let nextBeat = 0;

    const groups: { [key: string]: number } = {};

    for (let i = 0, len = timingPoints.length; i < len; ++i) {
      if (timingPoints[i].startTime > lastTime) {
        break;
      }

      nextTime = i === len - 1 ? lastTime : timingPoints[i + 1].startTime;
      nextBeat = RoundHelper.round(timingPoints[i].beatLength * 1000) / 1000;

      if (!groups[nextBeat]) {
        groups[nextBeat] = 0;
      }

      groups[nextBeat] += (nextTime - timingPoints[i].startTime);
    }

    const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);

    return 60000 / Number(entries[0][0]);
  }

  /**
   * The total break time of a beatmap.
   */
  get totalBreakTime(): number {
    return (this.events.breaks || []).reduce((d, e) => d + e.duration, 0);
  }

  /**
   * Creates a copy of this beatmap.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied beatmap.
   */
  clone(): this {
    const Beatmap = this.constructor as new () => this;

    const cloned = new Beatmap();

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone());
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}
