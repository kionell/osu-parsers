import { ReplayButtonState } from './Enums/ReplayButtonState';
import { ReplayFrame } from './ReplayFrame';
import { Vector2 } from '../Types';

/**
 * Parsed replay frame.
 */
export class LegacyReplayFrame extends ReplayFrame {
  /**
   * Button state of this replay frame.
   */
  buttonState: ReplayButtonState;

  /**
   * Mouse position of this replay frame.
   */
  position: Vector2;

  constructor(
    startTime?: number,
    interval?: number,
    position?: Vector2,
    buttonState?: ReplayButtonState,
  ) {
    super(startTime, interval);

    this.position = position ?? new Vector2(0, 0);
    this.buttonState = buttonState ?? ReplayButtonState.None;
  }

  /**
   * Mouse X-position of this replay frame.
   */
  get mouseX(): number {
    return this.position.x;
  }

  /**
   * Mouse Y-position of this replay frame.
   */
  get mouseY(): number {
    return this.position.y;
  }

  /**
   * Mouse position of this replay frame.
   */
  get mousePosition(): Vector2 {
    return new Vector2(this.mouseX ?? 0, this.mouseY ?? 0);
  }

  get mouseLeft(): boolean {
    return this.mouseLeft1 || this.mouseLeft2;
  }

  get mouseRight(): boolean {
    return this.mouseRight1 || this.mouseRight2;
  }

  get mouseLeft1(): boolean {
    return (this.buttonState & ReplayButtonState.Left1) > 0;
  }

  get mouseRight1(): boolean {
    return (this.buttonState & ReplayButtonState.Right1) > 0;
  }

  get mouseLeft2(): boolean {
    return (this.buttonState & ReplayButtonState.Left2) > 0;
  }

  get mouseRight2(): boolean {
    return (this.buttonState & ReplayButtonState.Right2) > 0;
  }

  get smoke(): boolean {
    return (this.buttonState & ReplayButtonState.Smoke) > 0;
  }

  /**
   * Creates a deep copy of the replay frame.
   * @returns Cloned replay frame.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.buttonState = this.buttonState;
    cloned.position = this.position.clone();

    return cloned;
  }
}
