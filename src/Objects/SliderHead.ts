import { Circle } from './Circle';
import { NestedType, INestedHitObject } from 'osu-resources';

export class SliderHead extends Circle implements INestedHitObject {
  nestedType: NestedType = NestedType.Head;

  spanIndex = 0;

  spanStartTime = 0;

  progress = 0;
}
