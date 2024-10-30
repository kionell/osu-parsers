import { IHasPath } from './IHasPath';
import { IHasRepeats } from './IHasRepeats';

/**
 * A HitObject that has a curve.
 */
export interface IHasPathWithRepeats extends IHasPath, IHasRepeats {}
