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
  buttonState: ReplayButtonState = ReplayButtonState.None;

  /**
   * Mouse X-position of this replay frame.
   */
  mouseX = 0;

  /**
   * Mouse Y-position of this replay frame.
   */
  mouseY = 0;

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
    return !!(this.buttonState & ReplayButtonState.Left1);
  }

  get mouseRight1(): boolean {
    return !!(this.buttonState & ReplayButtonState.Right1);
  }

  get mouseLeft2(): boolean {
    return !!(this.buttonState & ReplayButtonState.Left2);
  }

  get mouseRight2(): boolean {
    return !!(this.buttonState & ReplayButtonState.Right2);
  }

  /**
   * Creates a deep copy of the replay frame.
   * @returns Cloned replay frame.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.buttonState = this.buttonState;
    cloned.mouseX = this.mouseX;
    cloned.mouseY = this.mouseY;

    return cloned;
  }
}
