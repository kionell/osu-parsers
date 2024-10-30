import { RulesetBeatmap } from 'osu-classes';
import { ManiaHitObject, Note, Hold } from '../Objects';
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
   * in this {@link ManiaBeatmap} before any user adjustments.
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
      if (obj instanceof Note) {
        return combo + 1;
      }

      if (obj instanceof Hold) {
        return combo + 1 + Math.trunc((obj.endTime - obj.startTime) / 100);
      }

      return combo;
    }, 0);
  }

  get notes(): Note[] {
    return this.hitObjects.filter((h) => h instanceof Note) as Note[];
  }

  get holds(): Hold[] {
    return this.hitObjects.filter((h) => h instanceof Hold) as Hold[];
  }
}
