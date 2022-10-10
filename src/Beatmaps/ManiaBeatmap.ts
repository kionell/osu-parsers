import {
  RulesetBeatmap,
  HitType,
  IHasDuration,
} from 'osu-classes';

import { ManiaHitObject } from '../Objects';
import { ManiaModCombination } from '../Mods';
import { StageDefinition } from './StageDefinition';

export class ManiaBeatmap extends RulesetBeatmap {
  mods: ManiaModCombination = new ManiaModCombination();

  /**
   * The definitions for each stage in a osu!mania playfield.
   */
  stages: StageDefinition[] = [];

  /**
   * The total number of columns that were present
   * in this ManiaBeatmap before any user adjustments.
   */
  readonly originalTotalColumns: number = 0;

  hitObjects: ManiaHitObject[] = [];

  constructor(stage: StageDefinition, columns?: number) {
    super();

    this.stages.push(stage);
    this.originalTotalColumns = columns || stage.columns;
  }

  /**
   * Beatmap game mode.
   */
  get mode(): number {
    return 3;
  }

  /**
   * Total number of columns represented by all stages in this ManiaBeatmap.
   */
  get totalColumns(): number {
    return this.stages.reduce((c, s) => c + s.columns, 0);
  }

  get maxCombo(): number {
    return this.hitObjects.reduce((combo, obj) => {
      if (obj.hitType & HitType.Hold) {
        const hold = obj as ManiaHitObject & IHasDuration;

        return combo + 1 + Math.trunc((hold.endTime - hold.startTime) / 100);
      }

      return combo;
    }, this.notes);
  }

  get notes(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Normal ? 1 : 0);
    }, 0);
  }

  get holds(): number {
    return this.hitObjects.reduce((c, h) => {
      return c + (h.hitType & HitType.Hold ? 1 : 0);
    }, 0);
  }
}
