import { JuiceDrop } from './JuiceDrop';
import { NestedType, INestedHitObject } from 'osu-resources';

export class JuiceDroplet extends JuiceDrop implements INestedHitObject {
  nestedType: NestedType = NestedType.JuiceDroplet;

  progress = 0;
}
