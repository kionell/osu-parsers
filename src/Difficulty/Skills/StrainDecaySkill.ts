import { DifficultyHitObject } from '../Preprocessing/DifficultyHitObject';
import { StrainSkill } from './StrainSkill';

/**
 * Used to processes strain values of difficulty hit objects, 
 * keep track of strain levels caused by the processed objects
 * and to calculate a final difficulty value representing 
 * the difficulty of hitting all the processed objects.
 */
export abstract class StrainDecaySkill extends StrainSkill {
  /**
   * Strain values are multiplied by this number for the given skill. 
   * Used to balance the value of different skills between each other.
   */
  protected abstract _skillMultiplier: number;

  /**
   * Determines how quickly strain decays for the given skill.
   * For example a value of 0.15 indicates 
   * that strain decays to 15% of its original value in one second.
   */
  protected abstract _strainDecayBase: number;

  /**
   * The current strain level.
   */
  protected _currentStrain = 0;

  protected _calculateInitialStrain(time: number): number {
    const strainDecay = this._strainDecay(time - this._previous.get(0).startTime);

    return this._currentStrain * strainDecay;
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    this._currentStrain *= this._strainDecay(current.deltaTime);
    this._currentStrain += this._strainValueOf(current) * this._skillMultiplier;

    return this._currentStrain;
  }

  /**
   * Calculates the strain value of a {@link DifficultyHitObject}. 
   * This value is affected by previously processed objects.
   */
  protected abstract _strainValueOf(current: DifficultyHitObject): number;

  private _strainDecay(ms: number): number {
    return Math.pow(this._strainDecayBase, ms / 1000);
  }
}
