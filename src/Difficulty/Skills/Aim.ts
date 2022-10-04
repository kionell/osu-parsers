import { DifficultyHitObject } from 'osu-classes';
import { StandardStrainSkill } from './StandardStrainSkill';
import { StandardModCombination } from '../../Mods';
import { AimEvaluator } from '../Evaluators';

/**
 * Represents the skill required to correctly aim at every object 
 * in the map with a uniform CircleSize and normalized distances.
 */
export class Aim extends StandardStrainSkill {
  private static _SKILL_MULTIPLIER = 23.55;
  private static _STRAIN_DECAY_BASE = 0.15;

  private _currentStrain = 0;

  private readonly _withSliders: boolean;

  constructor(mods: StandardModCombination, withSliders: boolean) {
    super(mods);
    this._withSliders = withSliders;
  }

  private _strainDecay(ms: number) {
    return Math.pow(Aim._STRAIN_DECAY_BASE, ms / 1000);
  }

  protected _calculateInitialStrain(time: number, current: DifficultyHitObject): number {
    return this._currentStrain * this._strainDecay(time - current.previous(0).startTime);
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    this._currentStrain *= this._strainDecay(current.deltaTime);
    this._currentStrain += AimEvaluator.evaluateDifficultyOf(current, this._withSliders);
    this._currentStrain *= Aim._SKILL_MULTIPLIER;

    return this._currentStrain;
  }
}
