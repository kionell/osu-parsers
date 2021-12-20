import { DifficultyAttributes } from './Attributes/DifficultyAttributes';
import { ModBitwise } from '../Mods';
import { IRuleset } from '../Rulesets';
import { IScoreInfo } from '../Scoring';

export abstract class PerformanceCalculator {
  readonly attributes: DifficultyAttributes;

  protected readonly _ruleset: IRuleset;
  protected readonly _score: IScoreInfo;

  protected _clockRate = 1;

  constructor(ruleset: IRuleset, attributes: DifficultyAttributes, score: IScoreInfo) {
    this._ruleset = ruleset;
    this._score = score;

    if (!attributes) {
      throw new Error('Attributes are null!');
    }

    this.attributes = attributes;

    if (score.mods?.has(ModBitwise.DoubleTime || ModBitwise.Nightcore)) {
      this._clockRate = 1.5;
    }

    if (score.mods?.has(ModBitwise.HalfTime)) {
      this._clockRate = 0.75;
    }
  }

  abstract calculate(): number;
}
