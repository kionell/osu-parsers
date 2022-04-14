import { ILifeBarFrame } from './ILifeBarFrame';

/**
 * A life bar frame.
 */
export class LifeBarFrame implements ILifeBarFrame {
  /**
   * Starting time of this life bar frame.
   */
  startTime = 0;

  /**
   * The amount of HP at that current time.
   * This value is in range of 0-1.
   */
  health = 0;

  /**
   * Creates a deep copy of the replay frame.
   * @returns Cloned replay frame.
   */
  clone(): this {
    const LifeBarFrame = this.constructor as new () => this;

    const cloned = new LifeBarFrame();

    cloned.startTime = this.startTime;
    cloned.health = this.health;

    return cloned;
  }
}
