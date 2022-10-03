import { DifficultyHitObject } from 'osu-classes';
import { Slider, Spinner } from '../../Objects';
import { StandardModCombination } from '../../Mods';
import { StandardDifficultyHitObject } from '../Preprocessing/StandardDifficultyHitObject';
import { StandardStrainSkill } from './StandardStrainSkill';
import { AimEvaluator } from '../Evaluators/AimEvaluator';

/**
 * Represents the skill required to correctly aim at every object 
 * in the map with a uniform CircleSize and normalized distances.
 */
export class Aim extends StandardStrainSkill {
  private readonly _withSliders: boolean;

  private _currentStrain = 0;
  private _skillMultiplier = 23.25;
  private _strainDecayBase = 0.15;

  protected get _historyLength(): number {
    return 2;
  }

  constructor(mods: StandardModCombination, withSliders: boolean) {
    super(mods);
    this._withSliders = withSliders;
  }

  private _strainDecay(ms:number) : number {
    return Math.pow(this._strainDecayBase, ms / 1000);
  }

  // TODO
  private _calculateInitialStrain(time: number, current: DifficultyHitObject) : number {
    return this._currentStrain * this._strainDecay(time - current.lastObject.startTime);
  } 

  private _strainValueAt(current: DifficultyHitObject) {
    this._currentStrain *= this._strainDecay(current.deltaTime);
    this._currentStrain += AimEvaluator.
  }
}
