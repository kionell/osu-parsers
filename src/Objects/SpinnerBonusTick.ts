import { SpinnerTick } from './SpinnerTick';
import { NestedType } from 'osu-resources';

export class SpinnerBonusTick extends SpinnerTick {
  nestedType: NestedType = NestedType.BonusTick;

  progress = 1;
}
