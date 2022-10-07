import { DifficultyHitObject, StrainDecaySkill } from 'osu-classes';
import { ColourEvaluator } from '../Evaluators';

/**
 * Calculates the colour coefficient of taiko difficulty.
 */
export class Colour extends StrainDecaySkill {
  protected _skillMultiplier = 0.12;

  /**
   * This is set to decay slower than other skills, due to the fact 
   * that only the first note of each encoding class having any difficulty values, 
   * and we want to allow colour difficulty to be able to build up even on slower maps.
   */
  protected _strainDecayBase = 0.8;

  protected _strainValueOf(current: DifficultyHitObject): number {
    return ColourEvaluator.evaluateDifficultyOf(current);
  }
}
