import {
  DifficultyAttributes,
  IMod,
  ModBitwise,
  ModType,
  PerformanceCalculator,
  IRuleset,
  IScoreInfo,
} from 'osu-classes';

import {
  ManiaDifficultyAttributes,
  ManiaPerformanceAttributes,
} from './Attributes';

import { ManiaModCombination } from '../Mods';

export class ManiaPerformanceCalculator extends PerformanceCalculator {
  readonly attributes: ManiaDifficultyAttributes;

  private _mods: ManiaModCombination;

  private _countPerfect;
  private _countGreat;
  private _countGood;
  private _countOk;
  private _countMeh;
  private _countMiss;

  /**
   * Score after being scaled by non-difficulty-increasing mods.
   */
  private _scaledScore;

  constructor(ruleset: IRuleset, attributes: DifficultyAttributes, score: IScoreInfo) {
    super(ruleset, attributes, score);

    this.attributes = attributes as ManiaDifficultyAttributes;
    this._mods = (score?.mods as ManiaModCombination) ?? new ManiaModCombination();

    this._scaledScore = score.totalScore ?? 0;
    this._countPerfect = score.statistics.perfect ?? 0;
    this._countGreat = score.statistics.great ?? 0;
    this._countGood = score.statistics.good ?? 0;
    this._countOk = score.statistics.ok ?? 0;
    this._countMeh = score.statistics.meh ?? 0;
    this._countMiss = score.statistics.miss ?? 0;
  }

  calculateAttributes(): ManiaPerformanceAttributes {
    let scoreMultiplier = 1;

    for (const mod of this._mods.all) {
      if (this._scoreIncreaseMods.has(mod)) continue;

      scoreMultiplier *= mod.multiplier;
    }

    /**
     * Scale score up, so it's comparable to other keymods
     */
    this._scaledScore *= 1.0 / scoreMultiplier;

    /**
     * Arbitrary initial value for scaling pp in order 
     * to standardize distributions across game modes.
     * The specific number has no intrinsic meaning 
     * and can be adjusted as needed.
     */
    let multiplier = 0.8;

    if (this._mods.has(ModBitwise.NoFail)) {
      multiplier *= 0.9;
    }

    if (this._mods.has(ModBitwise.Easy)) {
      multiplier *= 0.5;
    }

    const strainValue = this._computeStrainValue();
    const accValue = this._computeAccuracyValue(strainValue);

    const totalValue = Math.pow(
      Math.pow(strainValue, 1.1) +
      Math.pow(accValue, 1.1), 1.0 / 1.1,
    ) * multiplier;

    const attributes = new ManiaPerformanceAttributes(this._mods, totalValue);

    attributes.strainPerformance = strainValue;
    attributes.accuracyPerformance = accValue;

    return attributes;
  }

  private _computeStrainValue(): number {
    /**
     * Obtain strain difficulty.
     */
    const max = Math.max(1, this.attributes.starRating / 0.2);
    let strainValue = Math.pow(5 * max - 4.0, 2.2) / 135.0;

    /**
     * Longer maps are worth more.
     */
    strainValue *= 1.0 + 0.1 * Math.min(1.0, this._totalHits / 1500.0);

    return strainValue * this._getStrainMultiplier(this._scaledScore);
  }

  private _computeAccuracyValue(strainValue: number) {
    const scaledScore = this._scaledScore;
    const greatHitWindow = this.attributes.greatHitWindow;

    if (greatHitWindow <= 0) return 0;

    /**
     * Lots of arbitrary values from testing.
     * Considering to use derivation from perfect accuracy 
     * in a probabilistic manner - assume normal distribution
     */
    let accuracyValue = 1;

    accuracyValue *= Math.max(0.0, 0.2 - (greatHitWindow - 34) * 0.006667);
    accuracyValue *= Math.pow(Math.max(0.0, scaledScore - 960000) / 40000, 1.1);
    accuracyValue *= strainValue;

    return accuracyValue;
  }

  private _getStrainMultiplier(scaledScore: number) {
    if (scaledScore <= 500000) return 0;

    if (scaledScore <= 600000) {
      return (scaledScore - 500000) / 100000 * 0.3;
    }

    if (scaledScore <= 700000) {
      return 0.3 + (scaledScore - 600000) / 100000 * 0.25;
    }

    if (scaledScore <= 800000) {
      return 0.55 + (scaledScore - 700000) / 100000 * 0.20;
    }

    if (scaledScore <= 900000) {
      return 0.75 + (scaledScore - 800000) / 100000 * 0.15;
    }

    return 0.90 + (scaledScore - 900000) / 100000 * 0.1;
  }

  private get _totalHits(): number {
    return this._countPerfect + this._countOk + this._countGreat +
      this._countGood + this._countMeh + this._countMiss;
  }

  private get _scoreIncreaseMods(): Set<IMod> {
    return new Set(this._mods.all.filter((m) => m.type === ModType.DifficultyIncrease));
  }
}
