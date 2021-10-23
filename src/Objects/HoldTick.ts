import { NestedType, INestedHitObject } from 'osu-resources';
import { ManiaHitObject } from './ManiaHitObject';

export class HoldTick extends ManiaHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.Tick;

  progress = 0;
}
