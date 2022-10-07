import { TaikoHitWindows } from '../Scoring';
import { TaikoHitObject } from './TaikoHitObject';

export class DrumRollTick extends TaikoHitObject {
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

  hitWindows = TaikoHitWindows.empty;

  clone(): this {
    const cloned = super.clone();

    cloned.firstTick = this.firstTick;
    cloned.tickInterval = this.tickInterval;

    return cloned;
  }
}
