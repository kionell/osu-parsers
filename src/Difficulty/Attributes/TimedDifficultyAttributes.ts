import { DifficultyAttributes } from './DifficultyAttributes';

/**
 * Wraps a DifficultyAttributes object and adds a time value for which the attribute is valid.
 */
export class TimedDifficultyAttributes {
  /**
   * The non-clock-adjusted time value at which the attributes take effect.
   */
  readonly time: number;

  /**
   * The difficulty attributes.
   */
  readonly attributes: DifficultyAttributes;

  /**
   * Creates new timed difficulty attributes.
   * @param time The non-clock-adjusted time value at which the attributes take effect.
   * @param attributes The difficuty attributes.
   */
  constructor(time: number, attributes: DifficultyAttributes) {
    this.time = time;
    this.attributes = attributes;
  }

  compareTo(other: TimedDifficultyAttributes): number {
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
