import { DifficultyAttributes } from './DifficultyAttributes';

/**
 * Wraps a DifficultyAttributes object and adds a time value for which the attribute is valid.
 */
export class TimedDifficultyAttributes<T extends DifficultyAttributes> {
  /**
   * The non-clock-adjusted time value at which the attributes take effect.
   */
  readonly time: number;

  /**
   * The difficulty attributes.
   */
  readonly attributes: T;

  /**
   * Creates new timed difficulty attributes.
   * @param time The non-clock-adjusted time value at which the attributes take effect.
   * @param attributes The difficuty attributes.
   */
  constructor(time: number, attributes: T) {
    this.time = time;
    this.attributes = attributes;
  }

  compareTo(other: TimedDifficultyAttributes<T>): number {
    if (this.time < other.time) return -1;
    if (this.time > other.time) return 1;
    if (this.time === other.time) return 0;

    // At least one of the values is NaN.
    if (!Number.isFinite(this.time)) {
      return (!Number.isFinite(other.time) ? 0 : -1);
    }

    return 1;
  }
}
