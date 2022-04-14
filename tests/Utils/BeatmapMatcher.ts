import {
  IHitStatistics,
  ScoreInfo,
} from 'osu-classes';

import {
  CatchBeatmap,
  CatchDifficultyAttributes,
  CatchModCombination,
  CatchRuleset,
  JuiceFruit,
  JuiceDroplet,
  JuiceTinyDroplet,
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
  private _ruleset: CatchRuleset = new CatchRuleset();

  /**
   * A beatmap which values will be matched.
   */
  private _beatmap: CatchBeatmap;

  constructor(beatmap: CatchBeatmap) {
    this._beatmap = beatmap;
  }

  matchBeatmapValues(values: IBeatmapValues): void {
    expect(this._beatmap.fruits).toEqual(values.hittable);
    expect(this._beatmap.juiceStreams).toEqual(values.slidable);
    expect(this._beatmap.bananaShowers).toEqual(values.spinnable);
    expect(this._beatmap.hitObjects.length).toEqual(values.objects);
    expect(this._beatmap.maxCombo).toEqual(values.maxCombo);
  }

  matchModdedValues(moddedValues: IModdedValues, moddedBeatmap: CatchBeatmap): void {
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
      const mods = atts.mods as CatchModCombination;

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

  private _getStatistics(beatmap: CatchBeatmap): Pick<IHitStatistics, 'great' | 'smallTickHit' | 'largeTickHit'> {
    const nestedFruits = beatmap.hitObjects.reduce((f, h) => {
      const nested = h.nestedHitObjects;

      return f + nested.reduce((f, h) => f + (h instanceof JuiceFruit ? 1 : 0), 0);
    }, 0);

    const smallTickHit = beatmap.hitObjects.reduce((t, h) => {
      return t + h.nestedHitObjects.reduce((t, h) => {
        return t + (h instanceof JuiceTinyDroplet ? 1 : 0);
      }, 0);
    }, 0);

    const tickHit = beatmap.hitObjects.reduce((t, h) => {
      return t + h.nestedHitObjects.reduce((t, h) => {
        return t + (h instanceof JuiceDroplet ? 1 : 0);
      }, 0);
    }, 0);

    return {
      great: beatmap.fruits + nestedFruits,
      largeTickHit: tickHit - smallTickHit,
      smallTickHit,
    };
  }

  get difficultyAttributes(): CatchDifficultyAttributes[] {
    return [...this._ruleset.createDifficultyCalculator(this._beatmap).calculateAll()];
  }
}
