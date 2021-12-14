import {
  DifficultyAttributes,
  ModBitwise,
  PerformanceCalculator,
  Ruleset,
  ScoreInfo,
} from 'osu-classes';

import { TaikoModCombination } from '../Mods';
import { TaikoDifficultyAttributes } from './Attributes';

export class TaikoPerformanceCalculator extends PerformanceCalculator {
  readonly attributes: TaikoDifficultyAttributes;

  private _mods: TaikoModCombination;

  private _countGreat = 0;
  private _countOk = 0;
  private _countMeh = 0;
  private _countMiss = 0;

  constructor(ruleset: Ruleset, attributes: DifficultyAttributes, score: ScoreInfo) {
    super(ruleset, attributes, score);

    this.attributes = attributes as TaikoDifficultyAttributes;

    this._mods = (score?.mods as TaikoModCombination) ?? new TaikoModCombination();
    this._countGreat = this._score.statistics.great;
    this._countOk = this._score.statistics.ok;
    this._countMeh = this._score.statistics.meh;
    this._countMiss = this._score.statistics.miss;
  }

  calculate(): number {
    /**
     * Custom multipliers for NoFail and SpunOut.
     * This is being adjusted to keep the final pp value 
     * scaled around what it used to be when changing things.
     */
    let multiplier = 1.1;

    if (this._mods.has(ModBitwise.NoFail)) {
      multiplier *= 0.9;
    }

    if (this._mods.has(ModBitwise.Hidden)) {
      multiplier *= 1.1;
    }

    const strainValue = this._computeStrainValue();
    const accuracyValue = this._computeAccuracyValue();

    const totalValue = Math.pow(
      Math.pow(strainValue, 1.1) +
      Math.pow(accuracyValue, 1.1), 1.0 / 1.1,
    ) * multiplier;

    return totalValue;
  }

  private _computeStrainValue(): number {
    const max = Math.max(1.0, this.attributes.starRating / 0.0075);

    let strainValue = Math.pow(5.0 * max - 4.0, 2.0) / 100000.0;

    /**
     * Longer maps are worth more.
     */
    const lengthBonus = 1 + 0.1 * Math.min(1.0, this._totalHits / 1500.0);

    strainValue *= lengthBonus;

    /**
     * Penalize misses exponentially. 
     * This mainly fixes tag4 maps and the likes 
     * until a per-hitobject solution is available.
     */
    strainValue *= Math.pow(0.985, this._countMiss);

    if (this._mods.has(ModBitwise.Hidden)) {
      strainValue *= 1.025;
    }

    if (this._mods.has(ModBitwise.Flashlight)) {
      /**
       * Apply length bonus again if flashlight is on simply
       * because it becomes a lot harder on longer maps.
       */
      strainValue *= 1.05 * lengthBonus;
    }

    /**
     * Scale the speed value with accuracy slightly.
     */
    return strainValue * this._score.accuracy;
  }

  private _computeAccuracyValue(): number {
    if (this.attributes.greatHitWindow <= 0) {
      return 0;
    }

    /**
     * Lots of arbitrary values from testing.
     * Considering to use derivation from perfect accuracy 
     * in a probabilistic manner - assume normal distribution
     */
    const accValue = Math.pow(150.0 / this.attributes.greatHitWindow, 1.1)
      * Math.pow(this._score.accuracy, 15) * 22.0;

    /**
     * Bonus for many hitcircles - it's harder to keep good accuracy up for longer
     */
    return accValue * Math.min(1.15, Math.pow(this._totalHits / 1500.0, 0.3));
  }

  private get _totalHits(): number {
    return this._countGreat + this._countOk + this._countMeh + this._countMiss;
  }
}
