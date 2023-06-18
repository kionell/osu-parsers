import { IReplayFrame } from './IReplayFrame';

/**
 * A replay frame.
 */
export abstract class ReplayFrame implements IReplayFrame {
  /**
   * The time at which this {@link ReplayFrame} takes place.
   */
  startTime = 0;

  /**
   * Interval between this and previous replay frames.
   */
  interval = 0;

  /**
   * Creates a deep copy of the replay frame.
   * @returns Cloned replay frame.
   */
  clone(): this {
    const ReplayFrame = this.constructor as new () => this;

    const cloned = new ReplayFrame();

    cloned.startTime = this.startTime;
    cloned.interval = this.interval;

    return cloned;
  }
}
