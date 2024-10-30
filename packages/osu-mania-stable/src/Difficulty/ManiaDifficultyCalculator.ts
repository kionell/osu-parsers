import {
  DifficultyCalculator,
  DifficultyHitObject,
  IBeatmap,
  IMod,
  IRuleset,
  ModBitwise,
  RoundHelper,
  Skill,
  SortHelper,
} from 'osu-classes';

import {
  ManiaDoubleTime,
  ManiaDualStages,
  ManiaEasy,
  ManiaHalfTime,
  ManiaHardRock,
  ManiaKey1,
  ManiaKey2,
  ManiaKey3,
  ManiaKey4,
  ManiaKey5,
  ManiaKey6,
  ManiaKey7,
  ManiaKey8,
  ManiaKey9,
  ManiaModCombination,
} from '../Mods';

import { ManiaBeatmap } from '../Beatmaps';
import { Hold, ManiaHitObject } from '../Objects';
import { ManiaDifficultyAttributes } from './Attributes';
import { ManiaDifficultyHitObject } from './Preprocessing';
import { Strain } from './Skills';

export class ManiaDifficultyCalculator extends DifficultyCalculator<ManiaDifficultyAttributes> {
  private static STAR_SCALING_FACTOR = 0.018;

  private readonly _isForCurrentRuleset: boolean;
  private readonly _originalOverallDifficulty: number;

  constructor(beatmap: IBeatmap, ruleset: IRuleset) {
    super(beatmap, ruleset);

    this._isForCurrentRuleset = beatmap.originalMode === ruleset.id;
    this._originalOverallDifficulty = (beatmap.base ?? beatmap).difficulty.overallDifficulty;
  }

  protected _createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: ManiaModCombination,
    skills: Skill[],
    clockRate: number,
  ): ManiaDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new ManiaDifficultyAttributes(mods, 0);
    }

    const starRating = skills[0].difficultyValue
      * ManiaDifficultyCalculator.STAR_SCALING_FACTOR;

    const attributes = new ManiaDifficultyAttributes(mods, starRating);

    attributes.mods = mods;

    attributes.maxCombo = beatmap.hitObjects.reduce((combo, obj) => {
      if (obj instanceof Hold) {
        return combo + 1 + Math.trunc((obj.endTime - obj.startTime) / 100);
      }

      return combo + 1;
    }, 0);

    attributes.greatHitWindow = Math.ceil(
      Math.trunc(this._getHitWindow300(mods) * clockRate) / clockRate,
    );

    return attributes;
  }

  protected _createDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): ManiaDifficultyHitObject[] {
    const hitObjects = beatmap.hitObjects.slice() as ManiaHitObject[];

    const comparerFn = (a: ManiaHitObject, b: ManiaHitObject) => {
      return RoundHelper.round(a.startTime) - RoundHelper.round(b.startTime);
    };

    const sortedObjects = SortHelper.depthSort(hitObjects, comparerFn);

    const difficultyObjects: ManiaDifficultyHitObject[] = [];

    for (let i = 1; i < sortedObjects.length; ++i) {
      const object = new ManiaDifficultyHitObject(
        sortedObjects[i],
        sortedObjects[i - 1],
        clockRate,
        difficultyObjects,
        difficultyObjects.length,
      );

      difficultyObjects.push(object);
    }

    return difficultyObjects;
  }

  protected _sortObjects(input: DifficultyHitObject[]): DifficultyHitObject[] {
    /**
     * Sorting is done in {@link _createDifficultyHitObjects}, 
     * since the full list of hitobjects is required.
     */
    return input;
  }

  protected _createSkills(beatmap: IBeatmap, mods: ManiaModCombination): Skill[] {
    return [
      new Strain(mods, (beatmap as ManiaBeatmap)?.totalColumns ?? 0),
    ];
  }

  get difficultyMods(): IMod[] {
    const mods = [
      new ManiaDoubleTime(),
      new ManiaHalfTime(),
      new ManiaEasy(),
      new ManiaHardRock(),
    ];

    if (this._isForCurrentRuleset) return mods;

    return [
      ...mods,

      /**
       * If we are a convert, we can be played in any key mod.
       */
      new ManiaKey1(),
      new ManiaKey2(),
      new ManiaKey3(),
      new ManiaKey4(),
      new ManiaKey5(),
      new ManiaKey6(),
      new ManiaKey7(),
      new ManiaKey8(),
      new ManiaKey9(),
      new ManiaDualStages(),
    ];
  }

  private _getHitWindow300(mods: ManiaModCombination): number {
    const applyModAdjustments = (value: number) => {
      if (mods.has(ModBitwise.HardRock)) {
        return value / 1.4;
      }

      if (mods.has(ModBitwise.Easy)) {
        return value * 1.4;
      }

      return value;
    };

    if (this._isForCurrentRuleset) {
      const od = Math.min(10, Math.max(0, 10 - this._originalOverallDifficulty));

      return applyModAdjustments(34 + 3 * od);
    }

    if (RoundHelper.round(this._originalOverallDifficulty) > 4) {
      return applyModAdjustments(34);
    }

    return applyModAdjustments(47);
  }
}
