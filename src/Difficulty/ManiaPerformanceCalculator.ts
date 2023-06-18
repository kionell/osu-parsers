import {
  DifficultyAttributes,
  PerformanceCalculator,
  IRuleset,
  IScoreInfo,
  HitResult,
} from 'osu-classes';

import {
  ManiaDifficultyAttributes,
  ManiaPerformanceAttributes,
} from './Attributes';

import { ManiaEasy, ManiaModCombination, ManiaNoFail } from '../Mods';

export class ManiaPerformanceCalculator extends PerformanceCalculator {
  attributes: ManiaDifficultyAttributes;

  private _mods = new ManiaModCombination();

  private _countPerfect = 0;
  private _countGreat = 0;
  private _countGood = 0;
  private _countOk = 0;
  private _countMeh = 0;
  private _countMiss = 0;

  constructor(ruleset: IRuleset, attributes?: DifficultyAttributes, score?: IScoreInfo) {
    super(ruleset, attributes, score);

    this.attributes = attributes as ManiaDifficultyAttributes;

    this._addParams(attributes, score);
  }

  calculateAttributes(attributes?: DifficultyAttributes, score?: IScoreInfo): ManiaPerformanceAttributes {
    this._addParams(attributes, score);

    if (!this.attributes) {
      return new ManiaPerformanceAttributes(this._mods, 0);
    }

    /**
     * Arbitrary initial value for scaling pp in order 
     * to standardize distributions across game modes.
     * The specific number has no intrinsic meaning 
     * and can be adjusted as needed.
     */
    let multiplier = 8;

    if (this._mods.any(ManiaNoFail)) {
      multiplier *= 0.75;
    }

    if (this._mods.any(ManiaEasy)) {
      multiplier *= 0.5;
    }

    const difficultyValue = this._computeDifficultyValue();
    const totalValue = difficultyValue * multiplier;

    const performance = new ManiaPerformanceAttributes(this._mods, totalValue);

    performance.difficultyPerformance = difficultyValue;

    return performance;
  }

  private _computeDifficultyValue(): number {
    /**
     * Star rating to pp curve.
     */
    let difficultyValue = Math.pow(
      Math.max(this.attributes.starRating - 0.15, 0.05), 2.2,
    );

    /**
     * From 80% accuracy, 1/20th of total pp is awarded per additional 1% accuracy.
     */
    difficultyValue *= Math.max(0, 5 * this._customAccuracy - 4);

    /**
     * Length bonus, capped at 1500 notes.
     */
    difficultyValue *= 1 + 0.1 * Math.min(1, this._totalHits / 1500);

    return difficultyValue;
  }

  private _addParams(attributes?: DifficultyAttributes, score?: IScoreInfo): void {
    if (score) {
      this._mods = score?.mods as ManiaModCombination ?? this._mods;
      this._countPerfect = score.statistics.get(HitResult.Perfect) ?? 0;
      this._countGreat = score.statistics.get(HitResult.Great) ?? 0;
      this._countGood = score.statistics.get(HitResult.Good) ?? 0;
      this._countOk = score.statistics.get(HitResult.Ok) ?? 0;
      this._countMeh = score.statistics.get(HitResult.Meh) ?? 0;
      this._countMiss = score.statistics.get(HitResult.Miss) ?? 0;
    }

    if (attributes) {
      this.attributes = attributes as ManiaDifficultyAttributes;
    }
  }

  private get _totalHits(): number {
    return this._countPerfect + this._countOk + this._countGreat +
      this._countGood + this._countMeh + this._countMiss;
  }

  private get _customAccuracy(): number {
    const perfect = this._countPerfect;
    const great = this._countGreat;
    const good = this._countGood;
    const ok = this._countOk;
    const meh = this._countMeh;
    const totalHits = this._totalHits;

    if (!totalHits) return 0;

    return (perfect * 320 + great * 300 + good * 200 + ok * 100 + meh * 50) / (totalHits * 320);
  }
}
