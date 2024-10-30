import { ILifeBarFrame } from './ILifeBarFrame';

/**
 * A life bar frame.
 */
export class LifeBarFrame implements ILifeBarFrame {
  /**
   * Starting time of this life bar frame.
   */
  startTime: number;

  /**
   * The amount of HP at that current time.
   * This value is in range of 0-1.
   */
  health: number;

  constructor(startTime?: number, health?: number) {
    this.startTime = startTime ?? 0;
    this.health = health ?? 0;
  }

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
