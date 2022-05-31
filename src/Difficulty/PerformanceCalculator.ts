import { IRuleset } from '../Rulesets';
import { IScoreInfo } from '../Scoring';

import {
  DifficultyAttributes,
  PerformanceAttributes,
} from './Attributes';

export abstract class PerformanceCalculator {
  readonly attributes?: DifficultyAttributes;

  protected readonly _ruleset: IRuleset;
  protected readonly _score?: IScoreInfo;

  constructor(ruleset: IRuleset, attributes?: DifficultyAttributes, score?: IScoreInfo) {
    this._ruleset = ruleset;
    this._score = score;
    this.attributes = attributes;
  }

  /**
   * Calculates total performance of a score by using difficulty attributes of a beatmap.
   * @param attributes Difficulty attributes.
   * @param score Score information.
   * @returns Total performance of a score.
   */
  calculate(attributes?: DifficultyAttributes, score?: IScoreInfo): number {
    return this.calculateAttributes(attributes, score).totalPerformance;
  }

  /**
   * Calculates performance attributes of a score by using difficulty attributes of a beatmap.
   * @param attributes Difficulty attributes.
   * @param score Score information.
   * @returns Performance attributes of a score.
   */
  abstract calculateAttributes(attributes?: DifficultyAttributes, score?: IScoreInfo): PerformanceAttributes;
}
