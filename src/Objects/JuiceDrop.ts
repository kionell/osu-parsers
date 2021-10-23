import { PalpableHitObject } from './PalpableHitObject';
import { NestedType, INestedHitObject } from 'osu-resources';

export class JuiceDrop extends PalpableHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.JuiceDrop;

  progress = 0;
}
