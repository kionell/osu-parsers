import { DifficultyAttributes, ModBitwise, PerformanceCalculator, Ruleset, ScoreInfo } from 'osu-classes';
import { CatchModCombination } from '../Mods';
import { CatchDifficultyAttributes } from './Attributes';

export class CatchPerformanceCalculator extends PerformanceCalculator {
  readonly attributes: CatchDifficultyAttributes;

  private _mods: CatchModCombination;

  private _fruitsHit = 0;
  private _ticksHit = 0;
  private _tinyTicksHit = 0;
  private _tinyTicksMissed = 0;
  private _misses = 0;

  private _effectiveMissCount = 0;

  constructor(ruleset: Ruleset, attributes: DifficultyAttributes, score: ScoreInfo) {
    super(ruleset, attributes, score);

    this.attributes = attributes as CatchDifficultyAttributes;
    this._mods = (score?.mods as CatchModCombination) ?? new CatchModCombination();
    this._fruitsHit = this._score.statistics.great;
    this._ticksHit = this._score.statistics.largeTickHit;
    this._tinyTicksHit = this._score.statistics.smallTickHit;
    this._tinyTicksMissed = this._score.statistics.smallTickMiss;
    this._misses = this._score.statistics.miss;
  }

  calculate(): number {
    /**
     * We are heavily relying on aim in catch the beat.
     */
    const max = Math.max(1.0, this.attributes.starRating / 0.0049);
    let totalValue = Math.pow(5.0 * max - 4.0, 2.0) / 100000.0;

    /**
     * Longer maps are worth more.
     * "Longer" means how many hits there are which can contribute to combo.
     */
    const lengthBonus = 0.95 + 0.3 * Math.min(1.0, this._totalComboHits / 2500.0) +
      (this._totalComboHits > 2500 ? Math.log10(this._totalComboHits / 2500.0) * 0.475 : 0.0);

    /**
     * Longer maps are worth more
     */
    totalValue *= lengthBonus;

    /**
     * Penalize misses exponentially. 
     * This mainly fixes tag4 maps and the likes until a per-hitobject solution is available.
     */
    totalValue *= Math.pow(0.97, this._misses);

    /**
     * Combo scaling.
     */
    if (this.attributes.maxCombo > 0) {
      const scoreMaxCombo = Math.pow(this._score.maxCombo, 0.8);
      const maxCombo = Math.pow(this.attributes.maxCombo, 0.8);

      totalValue *= Math.min(scoreMaxCombo / maxCombo, 1.0);
    }

    const approachRate = this.attributes.approachRate;

    let approachRateFactor = 1;

    /**
     * 10% for each AR above 9.
     */
    if (approachRate > 9) {
      approachRateFactor += 0.1 * (approachRate - 9);
    }

    if (approachRate > 10) {
      /**
       * Additional 10% at AR 11, 30% total.
       */
      approachRateFactor += 0.1 * (approachRate - 10);
    }
    else if (approachRate < 8) {
      /**
       * 2.5% for each AR below 8
       */
      approachRateFactor += 0.025 * (8 - approachRate);
    }

    totalValue *= approachRateFactor;

    if (this._mods.has(ModBitwise.Hidden)) {
      /**
       * Hiddens gives almost nothing on max approach rate, and more the lower it is.
       */
      if (approachRate <= 10) {
        /**
         * 7.5% for each AR below 10.
         */
        totalValue *= 1.05 + 0.075 * (10 - approachRate);
      }
      else if (approachRate > 10) {
        /**
         * 5% at AR 10, 1% at AR 11.
         */
        totalValue *= 1.01 + 0.04 * (11 - Math.min(11, approachRate));
      }
    }

    if (this._mods.has(ModBitwise.Flashlight)) {
      /**
       * Apply length bonus again if flashlight is on simply 
       * because it becomes a lot harder on longer maps.
       */
      totalValue *= 1.35 * lengthBonus;
    }

    /**
     * Scale the aim value with accuracy slightly.
     */
    totalValue *= Math.pow(this._accuracy, 5.5);

    /**
     * Custom multipliers for NoFail. SpunOut is not applicable.
     */
    if (this._mods.has(ModBitwise.NoFail)) {
      totalValue *= 0.9;
    }

    return totalValue;
  }

  private get _accuracy(): number {
    return this._totalHits === 0 ? 0
      : Math.min(Math.max(this._totalSuccessfulHits / this._totalHits, 0), 1);
  }

  private get _totalHits(): number {
    return this._tinyTicksHit + this._ticksHit
      + this._fruitsHit + this._misses + this._tinyTicksMissed;
  }

  private get _totalSuccessfulHits(): number {
    return this._tinyTicksHit + this._ticksHit + this._fruitsHit;
  }

  private get _totalComboHits(): number {
    return this._misses + this._ticksHit + this._fruitsHit;
  }
}
