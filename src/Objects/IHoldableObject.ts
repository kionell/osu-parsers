import { IHasNodeSamples } from './Types/IHasNodeSamples';
import { IHasDuration } from './Types/IHasDuration';
import { IHitObject } from './IHitObject';

export interface IHoldableObject extends IHitObject, IHasDuration, IHasNodeSamples {}
