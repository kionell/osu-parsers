import {
  RulesetBeatmap,
  HitType,
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
      return combo + (obj.hitType & HitType.Hold ? obj.nestedHitObjects.length : 0);
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

  clone(): ManiaBeatmap {
    const stage = this.stages[0]?.clone()
      ?? new StageDefinition(this.originalTotalColumns);

    const cloned = new ManiaBeatmap(stage);

    if (this.stages.length > 1) {
      const dualStage = this.stages[1].clone();

      cloned.stages.push(dualStage);
    }

    cloned.general = this.general.clone();
    cloned.editor = this.editor.clone();
    cloned.difficulty = this.difficulty.clone();
    cloned.metadata = this.metadata.clone();
    cloned.colours = this.colours.clone();
    cloned.events = this.events.clone();
    cloned.controlPoints = this.controlPoints.clone();
    cloned.hitObjects = this.hitObjects.map((h) => h.clone() as ManiaHitObject);
    cloned.originalMode = this.originalMode;
    cloned.fileFormat = this.fileFormat;
    cloned.mods = this.mods.clone();

    if (this.base) {
      cloned.base = this.base;
    }

    return cloned;
  }
}
