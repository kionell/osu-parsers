import { Fruit } from './Fruit';
import { NestedType, INestedHitObject } from 'osu-resources';

export class JuiceFruit extends Fruit implements INestedHitObject {
  nestedType: NestedType = NestedType.JuiceFruit;

  progress = 0;
}
