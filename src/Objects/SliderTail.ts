import { SliderEnd } from './SliderEnd';
import { NestedType, INestedHitObject } from 'osu-resources';

export class SliderTail extends SliderEnd implements INestedHitObject {
  nestedType: NestedType = NestedType.Tail;

  spanIndex = 0;

  spanStartTime = 0;

  progress = 1;
}
