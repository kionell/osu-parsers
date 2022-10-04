import { StandardHitWindows } from '../Scoring';
import { StandardHitObject } from './StandardHitObject';

export class SpinnerTick extends StandardHitObject {
  hitWindows = StandardHitWindows.empty;
}
