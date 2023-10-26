import {
  BeatmapGeneralSection,
  BeatmapEditorSection,
  BeatmapDifficultySection,
  BeatmapMetadataSection,
  BeatmapColorSection,
  BeatmapEventSection,
} from './Sections';

import { IBeatmap } from './IBeatmap';
import { ControlPointInfo } from './ControlPoints';
import { HitObject, HitType, IHasDuration } from '../Objects';
import { RoundHelper } from '../Utils';

/**
 * A parsed beatmap.
 */
export class Beatmap implements IBeatmap {
  /**
   * The optional link to the base beatmap.
   * Base beatmap is preferrable for beatmap converters.
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
  colors: BeatmapColorSection = new BeatmapColorSection();

  /**
   * Beatmap events & Storyboard.
   */
  events: BeatmapEventSection = new BeatmapEventSection();

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
   * Original gamemode of a beatmap before any conversions.
   */
  originalMode = 0;

  /**
   * Beatmap gamemode.
   */
  get mode(): number {
    return this.originalMode;
  }

  /**
   * Playable beatmap length in milliseconds.
   */
  get length(): number {
    if (!this.hitObjects.length) {
      return 0;
    }

    const first = this.hitObjects[0];
    const last = this.hitObjects[this.hitObjects.length - 1];
    const durationLast = last as HitObject & IHasDuration;

    const startTime = first.startTime;
    const endTime = durationLast.endTime || last.startTime;

    return (endTime - startTime) / this.difficulty.clockRate;
  }

  /**
   * Total beatmap length in milliseconds.
   */
  get totalLength(): number {
    if (!this.hitObjects.length) {
      return 0;
    }

    const last = this.hitObjects[this.hitObjects.length - 1];
    const durationObject = last as HitObject & IHasDuration;

    const endTime = durationObject.endTime || last.startTime;

    return endTime / this.difficulty.clockRate;
  }

  /**
   * Minimal BPM of a beatmap.
   */
  get bpmMin(): number {
    const beats = this.controlPoints.timingPoints
      .map((t) => t.bpm)
      .filter((t) => t >= 0);

    if (beats.length) {
      const bpm = beats.reduce((bpm, beat) => Math.min(bpm, beat), Infinity);

      return bpm * this.difficulty.clockRate;
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
      const bpm = beats.reduce((bpm, beat) => Math.max(bpm, beat), 0);

      return bpm * this.difficulty.clockRate;
    }

    return 60;
  }

  /**
   * The most common BPM of a beatmap.
   */
  get bpm(): number {
    if (!this.controlPoints.timingPoints.length) {
      return this.bpmMax;
    }

    const timingPoints = this.controlPoints.timingPoints;
    const hitObjects = this.hitObjects;

    /**
     * The last playable time in the beatmap - the last timing point extends to this time.
     * Note: This is more accurate and may present different results because 
     * osu-stable didn't have the ability to calculate slider durations in this context.
     */
    const lastTimingPoint = timingPoints[timingPoints.length - 1];
    const lastHitObject = hitObjects[hitObjects.length - 1];
    const durationObject = lastHitObject as HitObject & IHasDuration;

    const lastTime = durationObject?.endTime
      ?? lastHitObject?.startTime
      ?? lastTimingPoint?.startTime
      ?? 0;

    let nextTime = 0;
    let nextBeat = 0;

    const groups: Record<string, number> = {};

    for (let i = 0, len = timingPoints.length; i < len; ++i) {
      nextTime = i === len - 1 ? lastTime : timingPoints[i + 1].startTime;
      nextBeat = RoundHelper.round(timingPoints[i].beatLength * 1000) / 1000;

      if (timingPoints[i].startTime > lastTime) {
        groups[nextBeat] = 0;

        continue;
      }

      if (!groups[nextBeat]) {
        groups[nextBeat] = 0;
      }

      groups[nextBeat] += (nextTime - timingPoints[i].startTime);
    }

    const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);

    return 60000 / Number(entries[0][0]) * this.difficulty.clockRate;
  }

  /**
   * The total break time of a beatmap.
   */
  get totalBreakTime(): number {
    return (this.events.breaks || []).reduce((d, e) => d + e.duration, 0);
  }

  /**
   * The ammount of hittable objects.
   */
  get hittable(): number {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }

  /**
   * The ammount of slidable objects.
   */
  get slidable(): number {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Slider ? 1 : 0);
    }, 0);
  }

  /**
   * The ammount of spinnable objects.
   */
  get spinnable(): number {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Spinner ? 1 : 0);
    }, 0);
  }

  /**
   * The ammount of holdable objects.
   */
  get holdable(): number {
    return this.hitObjects.reduce((s, h) => {
      return s + (h.hitType & HitType.Hold ? 1 : 0);
    }, 0);
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
    cloned.colors = this.colors.clone();
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
