import { DifficultyHitObject, StrainSkill } from 'osu-classes';
import { StandardHidden, StandardModCombination } from '../../Mods';
import { FlashlightEvaluator } from '../Evaluators';
import { StandardStrainSkill } from './StandardStrainSkill';

/**
 * Represents the skill required to memorise and hit every object in a map with the Flashlight mod enabled.
 */
export class Flashlight extends StrainSkill {
  private static readonly SKILL_MULTIPLIER = 0.052;
  private static readonly STRAIN_DECAY_BASE = 0.15;

  private _currentStrain = 0;

  private readonly _hasHiddenMod: boolean;

  constructor(mods: StandardModCombination) {
    super(mods);
    this._hasHiddenMod = mods.any(StandardHidden);
  }

  private _strainDecay(ms: number): number {
    return Math.pow(Flashlight.STRAIN_DECAY_BASE, ms / 1000);
  }

  protected _calculateInitialStrain(time: number, current: DifficultyHitObject): number {
    return this._currentStrain * this._strainDecay(time - (current.previous(0)?.startTime ?? 0));
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    this._currentStrain *= this._strainDecay(current.deltaTime);

    const flashlightValue = FlashlightEvaluator
      .evaluateDifficultyOf(current, this._hasHiddenMod);

    this._currentStrain += flashlightValue * Flashlight.SKILL_MULTIPLIER;

    return this._currentStrain;
  }

  get difficultyValue(): number {
    const strainSum = [...this.getCurrentStrainPeaks()].reduce((p, c) => p + c);

    return strainSum * StandardStrainSkill.DEFAULT_DIFFICULTY_MULTIPLIER;
  }
}
