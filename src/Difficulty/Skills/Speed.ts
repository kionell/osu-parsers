import { DifficultyHitObject } from 'osu-classes';
import { RhythmEvaluator, SpeedEvaluator } from '../Evaluators';
import { StandardDifficultyHitObject } from '../Preprocessing';
import { StandardStrainSkill } from './StandardStrainSkill';

/**
 * Represents the skill required to press keys with regards 
 * to keeping up with the speed at which objects need to be hit.
 */
export class Speed extends StandardStrainSkill {
  private static _SKILL_MULTIPLIER = 1375;
  private static _STRAIN_DECAY_BASE = 0.3;

  private _currentStrain = 0;
  private _currentRhythm = 0;

  protected _reducedSectionCount = 5;
  protected _difficultyMultiplier = 1.04;

  private readonly _objectStrains: number[] = [];

  private _strainDecay(ms: number): number {
    return Math.pow(Speed._STRAIN_DECAY_BASE, ms / 1000);
  }

  protected _calculateInitialStrain(time: number, current: DifficultyHitObject): number {
    const strainDecay = this._strainDecay(time - (current.previous(0)?.startTime ?? 0));

    return (this._currentStrain * this._currentRhythm) * strainDecay;
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    const standardCurrent = current as StandardDifficultyHitObject;

    this._currentStrain *= this._strainDecay(standardCurrent.strainTime);

    const speedValue = SpeedEvaluator.evaluateDifficultyOf(current);

    this._currentStrain += speedValue * Speed._SKILL_MULTIPLIER;
    this._currentRhythm = RhythmEvaluator.evaluateDifficultyOf(current);

    const totalStrain = this._currentStrain * this._currentRhythm;

    this._objectStrains.push(totalStrain);

    return totalStrain;
  }

  relevantNoteCount(): number {
    if (this._objectStrains.length === 0) return 0;

    const maxStrain = Math.max(...this._objectStrains);

    if (maxStrain === 0) return 0;

    return this._objectStrains.reduce((sum, strain) => {
      return sum + 1 / (1 + Math.exp(6 - strain / maxStrain * 12));
    }, 0);
  }
}
