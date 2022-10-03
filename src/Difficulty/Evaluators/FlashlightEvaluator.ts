import { DifficultyHitObject } from 'osu-classes';
import { Spinner, StandardHitObject } from '../../Objects';
import { StandardDifficultyHitObject } from '../Preprocessing/StandardDifficultyHitObject';
import { StandardStrainSkill } from './StandardStrainSkill';

import { StandardModCombination } from '../Mods';
  
import {
    StandardDifficultyAttributes,
    StandardPerformanceAttributes,
  } from './Attributes';
  
import { Aim, Speed, Flashlight } from './Skills';
import { StandardDifficultyAttributes } from './Attributes';
import { StandardDifficultyHitObject }  from './Preprocessing' ;
import { StandardHitWindows } from '../Scoring';
import { Circle, Slider, Spinner } from '../Objects';

export class FlashlightEvaluator {
    private _MaxOpacityBonus = 0.4;
    private _HiddenBonus = 0.2;
    private _MinVelocity = 0.5;
    private _SliderMultiplier = 1.3;
    private _MinAngleMultiplier = 0.2;

    /**
     * @summary Evaluates FL difficulty
     * @since May 28th
     * Evaluates the difficulty of memorising and hitting an object, based on:
     * - distance between a number of previous objects and the current object,
     * - the visual opacity of the current object,
     * - the angle made by the current object,
     * - length and speed of the current object (for sliders),
     * - and whether the hidden mod is enabled.
     */
    evaluateDifficultyOf(current: StandardDifficultyHitObject, hidden: boolean) :  {
        if (current.baseObject instanceof Spinner) return 0;
    
        const osuCurrent = current as StandardDifficultyHitObject;
        const osuHitObject = osuCurrent.baseObject as StandardHitObject;

        const scalingFactor = 52.0 / osuHitObject.radius;
        const smallDistNerf = 1.0;
        const cumulativeStrainTime = 0.0;
        const result = 0.0;

        const lastObj = osuCurrent;

        const angleRepeatCount = 0.0;

        for (let i = 0; i < Math.min(current.Index, 10); ++i) { 
            const currentObj = current.previous(i) as unknown as StandardDifficultyHitObject;
            const currentHitObject = currentObj.baseObject as StandardHitObject;
        }
    }
}