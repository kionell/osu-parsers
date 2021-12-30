import {
  IHitStatistics,
  ScoreInfo,
} from 'osu-classes';

import {
  TaikoBeatmap,
  TaikoDifficultyAttributes,
  TaikoModCombination,
  TaikoRuleset,
} from '../../src';

import {
  IBeatmapValues,
  IModdedValues,
  IStarRatings,
  IPerformances,
} from '../Interfaces';

/**
 * A helper class for matching beatmaps.
 */
export class BeatmapMatcher {
  /**
   * An instance of ruleset.
   */
  private _ruleset: TaikoRuleset = new TaikoRuleset();

  /**
   * A beatmap which values will be matched.
   */
  private _beatmap: TaikoBeatmap;

  constructor(beatmap: TaikoBeatmap) {
    this._beatmap = beatmap;
  }

  matchBeatmapValues(values: IBeatmapValues): void {
    expect(this._beatmap.hits).toEqual(values.hittable);
    expect(this._beatmap.drumRolls).toEqual(values.slidable);
    expect(this._beatmap.swells).toEqual(values.spinnable);
    expect(this._beatmap.hitObjects.length).toEqual(values.objects);
    expect(this._beatmap.maxCombo).toEqual(values.maxCombo);
  }

  matchModdedValues(moddedValues: IModdedValues, moddedBeatmap: TaikoBeatmap): void {
    expect(moddedBeatmap.difficulty.circleSize).toBeCloseTo(moddedValues.difficulty.circleSize);
    expect(moddedBeatmap.difficulty.approachRate).toBeCloseTo(moddedValues.difficulty.approachRate);
    expect(moddedBeatmap.difficulty.drainRate).toBeCloseTo(moddedValues.difficulty.drainRate);
    expect(moddedBeatmap.difficulty.overallDifficulty).toBeCloseTo(moddedValues.difficulty.overallDifficulty);
  }

  matchStarRatings(stars: IStarRatings): void {
    this.difficultyAttributes.forEach((atts) => {
      expect(atts.starRating).toBeCloseTo(stars[atts.mods.toString()], 1);
    });
  }

  matchPerformances(performances: IPerformances): void {
    this.difficultyAttributes.forEach((atts) => {
      const mods = atts.mods as TaikoModCombination;
      const beatmap = this._ruleset.applyToBeatmapWithMods(this._beatmap, mods);

      const score = new ScoreInfo({
        maxCombo: beatmap.maxCombo,
        statistics: this._getStatistics(beatmap),
        accuracy: 1,
        beatmap,
        mods,
      });

      const performanceCalculator = this._ruleset.createPerformanceCalculator(atts, score);
      const totalPerformace = performanceCalculator.calculate();

      expect(totalPerformace).toBeCloseTo(performances[atts.mods.toString()], 1);
    });
  }

  private _getStatistics(beatmap: TaikoBeatmap): Pick<IHitStatistics, 'great'> {
    return {
      great: beatmap.hits,
    };
  }

  get difficultyAttributes(): TaikoDifficultyAttributes[] {
    return [...this._ruleset.createDifficultyCalculator(this._beatmap).calculateAll()];
  }
}
