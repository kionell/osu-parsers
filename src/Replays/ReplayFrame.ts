import { ReplayButtonState } from './Enums';
import { IReplayFrame } from './IReplayFrame';

/**
 * A replay frame.
 */
export abstract class ReplayFrame implements IReplayFrame {
  /**
   * Button state of this replay frame.
   */
  buttonState: ReplayButtonState = ReplayButtonState.None;

  /**
   * Starting time of this replay frame.
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

    cloned.buttonState = this.buttonState;
    cloned.startTime = this.startTime;
    cloned.interval = this.interval;

    return cloned;
  }
}
