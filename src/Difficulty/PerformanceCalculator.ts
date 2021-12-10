import { DifficultyAttributes } from './Attributes/DifficultyAttributes';
import { ModBitwise } from '../Mods';
import { Ruleset } from '../Rulesets';
import { ScoreInfo } from '../Scoring';

export abstract class PerformanceCalculator {
  readonly attributes: DifficultyAttributes;

  protected readonly _ruleset: Ruleset;
  protected readonly _score: ScoreInfo;

  protected _clockRate = 1;

  constructor(ruleset: Ruleset, attributes: DifficultyAttributes, score: ScoreInfo) {
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
