import {
  IHitStatistics,
  ScoreInfo,
} from 'osu-classes';

import {
  ManiaBeatmap,
  ManiaDifficultyAttributes,
  ManiaRuleset,
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
  private _ruleset: ManiaRuleset = new ManiaRuleset();

  /**
   * A beatmap which values will be matched.
   */
  private _beatmap: ManiaBeatmap;

  constructor(beatmap: ManiaBeatmap) {
    this._beatmap = beatmap;
  }

  matchBeatmapValues(values: IBeatmapValues): void {
    expect(this._beatmap.notes).toEqual(values.hittable);
    expect(this._beatmap.holds).toEqual(values.holdable);
    expect(this._beatmap.hitObjects.length).toEqual(values.objects);
    expect(this._beatmap.maxCombo).toEqual(values.maxCombo);
  }

  matchStarRatings(stars: IStarRatings, attributes: ManiaDifficultyAttributes[]): void {
    attributes.forEach((atts) => {
      if (!stars[atts.mods.toString()]) return;

      expect(atts.starRating).toBeCloseTo(stars[atts.mods.toString()], 1);
    });
  }

  matchPerformances(performances: IPerformances, attributes: ManiaDifficultyAttributes[], beatmaps: ManiaBeatmap[]): void {
    attributes.forEach((atts) => {
      if (!performances[atts.mods.toString()]) return;

      const beatmap = beatmaps.find((b) => b.mods.equals(atts.mods)) as ManiaBeatmap;

      const score = new ScoreInfo({
        totalScore: 1e6 * atts.scoreMultiplier,
        statistics: this._getStatistics(beatmap),
        mods: atts.mods,
      });

      const performanceCalculator = this._ruleset.createPerformanceCalculator(atts, score);
      const totalPerformace = performanceCalculator.calculate();

      expect(totalPerformace).toBeCloseTo(performances[atts.mods.toString()], 2);
    });
  }

  private _getStatistics(beatmap: ManiaBeatmap): Pick<IHitStatistics, 'perfect'> {
    return {
      perfect: beatmap.hitObjects.length,
    };
  }

  get beatmaps(): ManiaBeatmap[] {
    const calculator = this._ruleset.createDifficultyCalculator(this._beatmap);

    const beatmaps = calculator.difficultyMods.map((mod) => {
      const combination = this._ruleset.createModCombination(mod.bitwise);

      return this._ruleset.applyToBeatmapWithMods(this._beatmap, combination);
    });

    beatmaps.push(this._ruleset.applyToBeatmap(this._beatmap));

    return beatmaps;
  }

  calculateDifficultyAttributes(beatmaps: ManiaBeatmap[]): ManiaDifficultyAttributes[] {
    return beatmaps.map((beatmap) => {
      const calculator = this._ruleset.createDifficultyCalculator(beatmap);

      return calculator.calculate() as ManiaDifficultyAttributes;
    });
  }
}
