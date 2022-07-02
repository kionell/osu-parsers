import { ReplayButtonState } from './Enums';

/**
 * A replay frame.
 */
export interface IReplayFrame {
  /**
   * Starting time of this replay frame.
   */
  startTime: number;

  /**
   * Interval between this and previous replay frames.
   */
  interval: number;

  /**
   * Button state of this replay frame.
   */
  buttonState: ReplayButtonState;

  /**
   * Mouse X-position of this replay frame.
   */
  mouseX: number;

  /**
   * Mouse Y-position of this replay frame.
   */
  mouseY: number;

  /**
   * Create a new copy of this replay frame. 
   * @returns A clone of replay frame.
   */
  clone(): IReplayFrame;
}
