import { StandardHitObject } from './StandardHitObject';
import { NestedType, INestedHitObject } from 'osu-resources';

export class SpinnerTick extends StandardHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.Tick;

  progress = 0;
}
