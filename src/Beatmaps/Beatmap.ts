import { HitObject, IHasDuration } from '../Objects';
import { ModCombination } from '../Mods';

import { BeatmapColoursSection } from './Sections/BeatmapColoursSection';
import { BeatmapDifficultySection } from './Sections/BeatmapDifficultySection';
import { BeatmapEditorSection } from './Sections/BeatmapEditorSection';
import { BeatmapEventsSection } from './Sections/BeatmapEventsSection';
import { BeatmapGeneralSection } from './Sections/BeatmapGeneralSection';
import { BeatmapMetadataSection } from './Sections/BeatmapMetadataSection';
import { ControlPointInfo } from './ControlPoints/ControlPointInfo';
import { IBeatmap } from './IBeatmap';

/**
 * A beatmap.
 */
export abstract class Beatmap implements IBeatmap {
  /**
   * A base beatmap.
   */
  base: IBeatmap;

  /**
   * A copy of difficulty section for applying mods.
   */
  difficulty: BeatmapDifficultySection;

  /**
   * The list of the beatmap hit objects.
   */
  hitObjects: HitObject[] = [];

  /**
   * Applied mods of a beatmap.
   */
  abstract appliedMods: ModCombination;

  constructor(beatmap: IBeatmap) {
    this.base = beatmap;
    this.difficulty = beatmap.difficulty.clone();
  }

  /**
   * The beatmap general info.
   */
  get general(): BeatmapGeneralSection {
    return this.base.general;
  }

  set general(value: BeatmapGeneralSection) {
    this.base.general = value;
  }

  /**
   * Editor settings of a beatmap.
   */
  get editor(): BeatmapEditorSection {
    return this.base.editor;
  }

  set editor(value: BeatmapEditorSection) {
    this.base.editor = value;
  }

  /**
   * Beatmap metadata.
   */
  get metadata(): BeatmapMetadataSection {
    return this.base.metadata;
  }

  set metadata(value: BeatmapMetadataSection) {
    this.base.metadata = value;
  }

  /**
   * Beatmap skin configuration.
   */
  get colours(): BeatmapColoursSection {
    return this.base.colours;
  }

  set colours(value: BeatmapColoursSection) {
    this.base.colours = value;
  }

  /**
   * Beatmap events.
   */
  get events(): BeatmapEventsSection {
    return this.base.events;
  }

  set events(value: BeatmapEventsSection) {
    this.base.events = value;
  }

  /**
   * Beatmap control points.
   */
  get controlPoints(): ControlPointInfo {
    return this.base.controlPoints;
  }

  set controlPoints(value: ControlPointInfo) {
    this.base.controlPoints = value;
  }

  /**
   * Beatmap game mode.
   */
  get mode(): number {
    return this.base.mode;
  }

  /**
   * Beatmap file format.
   */
  get fileFormat(): number {
    return this.base.fileFormat;
  }

  /**
   * Beatmap max possible combo.
   */
  abstract get maxCombo(): number;

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
      nextBeat = Math.round(timingPoints[i].beatLength * 1000) / 1000;

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
}
