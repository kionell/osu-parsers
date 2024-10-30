import { DifficultyHitObject, StrainDecaySkill } from 'osu-classes';
import { StaminaEvaluator } from '../Evaluators';

/**
 * Calculates the stamina coefficient of taiko difficulty.
 * The reference play style chosen uses two hands, with full alternating (the hand changes after every hit).
 */
export class Stamina extends StrainDecaySkill {
  protected _skillMultiplier = 1.1;
  protected _strainDecayBase = 0.4;

  protected _strainValueOf(current: DifficultyHitObject): number {
    return StaminaEvaluator.evaluateDifficultyOf(current);
  }
}
