import { DifficultyHitObject } from 'osu-classes';
import { Spinner, StandardHitObject } from '../../Objects';
import { StandardDifficultyHitObject } from '../Preprocessing/StandardDifficultyHitObject';
import { StandardStrainSkill } from './StandardStrainSkill';

/**
 * Represents the skill required to memorise and hit 
 * every object in a map with the Flashlight mod enabled.
 */
export class Flashlight extends StandardStrainSkill {
  private _skillMultiplier = 0.15;
  private _strainDecayBase = 0.15;

  protected _decayWeight = 1.0;

  private _currentStrain = 0;

  /**
   * Look back for 10 notes is added for the sake of flashlight calculations.
   */
  protected get _historyLength(): number {
    return 10;
  }

  private _strainValueOf(current: DifficultyHitObject): number {
    if (current.baseObject instanceof Spinner) {
      return 0;
    }

    const osuCurrent = current as StandardDifficultyHitObject;
    const osuHitObject = osuCurrent.baseObject as StandardHitObject;

    const scalingFactor = 52.0 / osuHitObject.radius;
    let smallDistNerf = 1.0;
    let cumulativeStrainTime = 0.0;

    let result = 0.0;

    for (let i = 0; i < this._previous.count; ++i) {
      const osuPrevious = this._previous.get(i) as StandardDifficultyHitObject;
      const osuPreviousHitObject = osuPrevious.baseObject as StandardHitObject;

      if (!(osuPrevious.baseObject instanceof Spinner)) {
        const jumpDistance = osuHitObject.stackedStartPosition
          .fsubtract(osuPreviousHitObject.endPosition)
          .flength();

        cumulativeStrainTime += osuPrevious.strainTime;

        /**
         * We want to nerf objects that can be easily seen 
         * within the Flashlight circle radius.
         */
        if (i === 0) {
          smallDistNerf = Math.min(1.0, jumpDistance / 75.0);
        }

        /**
         * We also want to nerf stacks so that only 
         * the first object of the stack is accounted for.
         */
        const stackNerf = Math.min(1.0, (osuPrevious.jumpDistance / scalingFactor) / 25.0);

        result += Math.pow(0.8, i) * stackNerf * scalingFactor * jumpDistance / cumulativeStrainTime;
      }
    }

    return Math.pow(smallDistNerf * result, 2.0);
  }

  private _strainDecay(ms: number): number {
    return Math.pow(this._strainDecayBase, ms / 1000);
  }

  protected _calculateInitialStrain(time: number): number {
    const strainDecay = this._strainDecay(time - this._previous.get(0).startTime);

    return this._currentStrain * strainDecay;
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    this._currentStrain *= this._strainDecay(current.deltaTime);
    this._currentStrain += this._strainValueOf(current) * this._skillMultiplier;

    return this._currentStrain;
  }
}
