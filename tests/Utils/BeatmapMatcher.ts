import {
  IHitStatistics,
  ScoreInfo,
} from 'osu-classes';

import {
  StandardBeatmap,
  StandardDifficultyAttributes,
  StandardModCombination,
  StandardRuleset,
} from '../../src';

import {
  IBeatmapValues,
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
  private _ruleset: StandardRuleset = new StandardRuleset();

  /**
   * A beatmap which values will be matched.
   */
  private _beatmap: StandardBeatmap;

  constructor(beatmap: StandardBeatmap) {
    this._beatmap = beatmap;
  }

  matchBeatmapValues(values: IBeatmapValues): void {
    expect(this._beatmap.maxCombo).toEqual(values.maxCombo);
  }

  matchStarRatings(stars: IStarRatings): void {
    this.difficultyAttributes.forEach((atts) => {
      expect(atts.starRating).toBeCloseTo(stars[atts.mods.toString()], 1);
    });
  }

  matchPerformances(performances: IPerformances): void {
    this.difficultyAttributes.forEach((atts) => {
      const mods = atts.mods as StandardModCombination;

      const score = new ScoreInfo({
        maxCombo: this._beatmap.maxCombo,
        statistics: this._getStatistics(this._beatmap),
        accuracy: 1,
        mods,
      });

      const performanceCalculator = this._ruleset.createPerformanceCalculator(atts, score);
      const totalPerformace = performanceCalculator.calculate();

      expect(totalPerformace).toBeCloseTo(performances[atts.mods.toString()], 1);
    });
  }

  private _getStatistics(beatmap: StandardBeatmap): Pick<IHitStatistics, 'great'> {
    return {
      great: beatmap.hitObjects.length,
    };
  }

  get difficultyAttributes(): StandardDifficultyAttributes[] {
    return [...this._ruleset.createDifficultyCalculator(this._beatmap).calculateAll()];
  }
}
