import { ReplayButtonState } from './Enums';

/**
 * A replay frame.
 */
export interface IReplayFrame {
  /**
   * Button state of this replay frame.
   */
  buttonState: ReplayButtonState;

  /**
   * Starting time of this replay frame.
   */
  startTime: number;

  /**
   * Interval between this and previous replay frames.
   */
  interval: number;
}
