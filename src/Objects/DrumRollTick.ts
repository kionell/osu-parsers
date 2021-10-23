import { TaikoHitObject } from './TaikoHitObject';
import { INestedHitObject, NestedType } from 'osu-resources';

export class DrumRollTick extends TaikoHitObject implements INestedHitObject {
  nestedType: NestedType = NestedType.Tick;

  progress = 0;

  /**
   * Whether this is the first (initial) tick of the slider.
   */
  firstTick = false;

  /**
   * The length (in milliseconds) between this tick and the next.
   * Half of this value is the hit window of the tick.
   */
  tickInterval = 0;

  /**
   * The time allowed to hit this tick.
   */
  get hitWindow(): number {
    return this.tickInterval / 2;
  }
}
