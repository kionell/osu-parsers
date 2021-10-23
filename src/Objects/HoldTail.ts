import { NestedType, INestedHitObject } from 'osu-resources';
import { Note } from './Note';

export class HoldTail extends Note implements INestedHitObject {
  nestedType: NestedType = NestedType.Tail;

  progress = 1;
}
