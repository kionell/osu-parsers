import { PalpableHitObject } from './PalpableHitObject';
import { NestedType, INestedHitObject } from 'osu-resources';

export class Banana extends PalpableHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.BonusTick;

  bananaIndex = 0;

  progress = 0;
}
