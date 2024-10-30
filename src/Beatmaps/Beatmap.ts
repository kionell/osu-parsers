import {
  BeatmapGeneralSection,
  BeatmapEditorSection,
  BeatmapDifficultySection,
  BeatmapMetadataSection,
  BeatmapColorSection,
  BeatmapEventSection,
} from './Sections';

import { IBeatmap } from './IBeatmap';
import { ControlPointInfo, TimingPoint } from './ControlPoints';
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

  private _getLongestBeatLength(unlimited: boolean): number {
    const longestBeat = this.controlPoints.timingPoints.reduce((b, t) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;

      return beatLength >= 0 ? Math.max(beatLength, b) : b;
    }, -Infinity);

    return isFinite(longestBeat) ? longestBeat : TimingPoint.DEFAULT_BEAT_LENGTH;
  }

  /**
   * Minimal BPM of a beatmap.
   */
  get bpmMin(): number {
    return 60000 / this._getLongestBeatLength(false) * this.difficulty.clockRate;
  }

  /**
   * Minimal BPM of a beatmap without any limits as it was in osu!stable.
   * Usage of {@link bpmMin} is preferable when working with osu!lazer.
   */
  get bpmMinUnlimited(): number {
    return 60000 / this._getLongestBeatLength(true) * this.difficulty.clockRate;
  }

  private _getShortestBeatLength(unlimited: boolean): number {
    const shortestBeat = this.controlPoints.timingPoints.reduce((b, t) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;

      return beatLength >= 0 ? Math.min(beatLength, b) : b;
    }, Infinity);

    return isFinite(shortestBeat) ? shortestBeat : TimingPoint.DEFAULT_BEAT_LENGTH;
  }

  /**
   * Maximal BPM of a beatmap.
   */
  get bpmMax(): number {
    return 60000 / this._getShortestBeatLength(false) * this.difficulty.clockRate;
  }

  /**
   * Maximal BPM of a beatmap without any limits as it was in osu!stable.
   * Usage of {@link bpmMax} is preferable when working with osu!lazer.
   */
  get bpmMaxUnlimited(): number {
    return 60000 / this._getShortestBeatLength(true) * this.difficulty.clockRate;
  }

  private _getMostCommonBeatLength(unlimited: boolean): number {
    if (!this.controlPoints.timingPoints.length) {
      return TimingPoint.DEFAULT_BEAT_LENGTH;
    }

    const timingPoints = this.controlPoints.timingPoints;
    const durationObject = this.hitObjects.at(-1) as HitObject & IHasDuration;

    /**
     * The last playable time in the beatmap - the last timing point extends to this time.
     * Note: This is more accurate and may present different results because 
     * osu-stable didn't have the ability to calculate slider durations in this context.
     */
    const lastTime = durationObject?.endTime
      ?? durationObject?.startTime
      ?? timingPoints.at(-1)?.startTime
      ?? 0;

    const groups = new Map<number, number>();

    timingPoints.forEach((t, i) => {
      const beatLength = unlimited ? t.beatLengthUnlimited : t.beatLength;
      const nextBeat = RoundHelper.round(beatLength * 1000) / 1000;

      if (!groups.has(nextBeat)) {
        groups.set(nextBeat, 0);
      }

      if (t.startTime > lastTime) return;

      /**
       * osu-stable forced the first control point to start at 0.
       * This is reproduced here to maintain compatibility 
       * around osu!mania scroll speed and song select display.
       */
      const currentTime = i === 0 ? 0 : t.startTime;
      const nextTime = i === timingPoints.length - 1
        ? lastTime : timingPoints[i + 1].startTime;

      const duration = groups.get(nextBeat) ?? 0;

      groups.set(nextBeat, duration + (nextTime - currentTime));
    });

    if (groups.size === 0) return this.bpmMax;

    return [...groups.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * The most common BPM of a beatmap.
   */
  get bpm(): number {
    return 60000 / this._getMostCommonBeatLength(false) * this.difficulty.clockRate;
  }

  /**
   * The most common BPM of a beatmap without any limits as it was in osu!stable.
   * Usage of {@link bpm} is preferable when working with osu!lazer.
   */
  get bpmUnlimited(): number {
    return 60000 / this._getMostCommonBeatLength(true) * this.difficulty.clockRate;
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
