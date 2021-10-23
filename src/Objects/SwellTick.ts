import { TaikoHitObject } from './TaikoHitObject';
import { NestedType, INestedHitObject } from 'osu-resources';

export class SwellTick extends TaikoHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.Tick;

  progress = 0;
}
