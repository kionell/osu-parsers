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

  clone(): DrumRollTick {
    const cloned = new DrumRollTick();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;
    cloned.firstTick = this.firstTick;
    cloned.tickInterval = this.tickInterval;

    return cloned;
  }
}
