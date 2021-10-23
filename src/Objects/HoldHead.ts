import { NestedType, INestedHitObject } from 'osu-resources';
import { Note } from './Note';

export class HoldHead extends Note implements INestedHitObject {
  nestedType: NestedType = NestedType.Head;

  progress = 0;
}
