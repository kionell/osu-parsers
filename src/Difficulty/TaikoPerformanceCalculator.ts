import {
  DifficultyAttributes,
  PerformanceCalculator,
  IRuleset,
  IScoreInfo,
} from 'osu-classes';

import {
  TaikoDifficultyAttributes,
  TaikoPerformanceAttributes,
} from './Attributes';

import {
  TaikoEasy,
  TaikoFlashlight,
  TaikoHardRock,
  TaikoHidden,
  TaikoModCombination,
} from '../Mods';

export class TaikoPerformanceCalculator extends PerformanceCalculator {
  attributes: TaikoDifficultyAttributes;

  private _mods = new TaikoModCombination();

  private _countGreat = 0;
  private _countOk = 0;
  private _countMeh = 0;
  private _countMiss = 0;
  private _accuracy = 1;

  private _effectiveMissCount = 0;

  constructor(ruleset: IRuleset, attributes?: DifficultyAttributes, score?: IScoreInfo) {
    super(ruleset, attributes, score);

    this.attributes = attributes as TaikoDifficultyAttributes;

    this._addParams(attributes, score);
  }

  calculateAttributes(attributes?: DifficultyAttributes, score?: IScoreInfo): TaikoPerformanceAttributes {
    this._addParams(attributes, score);

    if (!this.attributes || !this._score) {
      return new TaikoPerformanceAttributes(this._mods, 0);
    }

    let multiplier = 1.13;

    if (this._mods.any(TaikoHidden)) {
      multiplier *= 1.075;
    }

    if (this._mods.any(TaikoEasy)) {
      multiplier *= 0.975;
    }

    const difficultyValue = this._computeDifficultyValue();
    const accuracyValue = this._computeAccuracyValue();

    const totalValue = Math.pow(
      Math.pow(difficultyValue, 1.1) +
      Math.pow(accuracyValue, 1.1), 1 / 1.1,
    ) * multiplier;

    const performance = new TaikoPerformanceAttributes(this._mods, totalValue);

    performance.difficultyPerformance = difficultyValue;
    performance.accuracyPerformance = accuracyValue;

    return performance;
  }

  private _computeDifficultyValue(): number {
    const max = Math.max(1, this.attributes.starRating / 0.115);

    let difficultyValue = Math.pow(5 * max - 4, 2.25) / 1150;

    /**
     * Longer maps are worth more.
     */
    const lengthBonus = 1 + 0.1 * Math.min(1, this._totalHits / 1500);

    difficultyValue *= lengthBonus;
    difficultyValue *= Math.pow(0.986, this._effectiveMissCount);

    if (this._mods.any(TaikoEasy)) {
      difficultyValue *= 0.985;
    }

    if (this._mods.any(TaikoHidden)) {
      difficultyValue *= 1.025;
    }

    if (this._mods.any(TaikoHardRock)) {
      difficultyValue *= 1.05;
    }

    if (this._mods.any(TaikoFlashlight)) {
      difficultyValue *= 1.05 * lengthBonus;
    }

    return difficultyValue * Math.pow(this._accuracy, 2);
  }

  private _computeAccuracyValue(): number {
    if (this.attributes.greatHitWindow <= 0) {
      return 0;
    }

    let accuracyValue = Math.pow(60 / this.attributes.greatHitWindow, 1.1)
      * Math.pow(this._accuracy, 8)
      * Math.pow(this.attributes.starRating, 0.4) * 27;

    const lengthBonus = Math.min(1.15, Math.pow(this._totalHits / 1500, 0.3));

    accuracyValue *= lengthBonus;

    /**
     * Slight HDFL Bonus for accuracy. 
     * A clamp is used to prevent against negative values.
     */
    if (this._mods.any(TaikoFlashlight) && this._mods.any(TaikoHidden)) {
      accuracyValue *= Math.max(1.05, 1.075 * lengthBonus);
    }

    return accuracyValue;
  }

  private _addParams(attributes?: DifficultyAttributes, score?: IScoreInfo): void {
    if (score) {
      this._mods = score?.mods as TaikoModCombination ?? new TaikoModCombination();
      this._countGreat = score.statistics.great ?? this._countGreat;
      this._countOk = score.statistics.ok ?? this._countOk;
      this._countMeh = score.statistics.meh ?? this._countMeh;
      this._countMiss = score.statistics.miss ?? this._countMiss;
      this._accuracy = score.accuracy ?? this._accuracy;
    }

    /**
     * The effectiveMissCount is calculated by gaining a ratio for {@link totalSuccessfulHits} 
     * and increasing the miss penalty for shorter object counts lower than 1000.
     */
    if (this._totalSuccessfulHits > 0) {
      this._effectiveMissCount = Math.max(1, 1000 / this._totalSuccessfulHits) * this._countMiss;
    }

    if (attributes) {
      this.attributes = attributes as TaikoDifficultyAttributes;
    }
  }

  private get _totalHits(): number {
    return this._countGreat + this._countOk + this._countMeh + this._countMiss;
  }

  private get _totalSuccessfulHits(): number {
    return this._countGreat + this._countOk + this._countMeh;
  }
}
