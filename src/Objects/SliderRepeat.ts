import { SliderEnd } from './SliderEnd';
import { NestedType, INestedHitObject } from 'osu-resources';

export class SliderRepeat extends SliderEnd implements INestedHitObject {
  nestedType: NestedType = NestedType.Repeat;

  spanIndex = 0;

  spanStartTime = 0;

  progress = 0;
}
