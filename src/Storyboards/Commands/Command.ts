import { CommandType, Easing } from '../Enums';

/**
 * A storyboard command.
 */
export class Command<T = any> {
  /**
   * Command type.
   */
  type: CommandType = CommandType.None;

  /**
   * The easing of the storyboard command.
   */
  easing: Easing = Easing.None;

  /**
   * The time at which the command starts.
   */
  startTime = 0;

  /**
   * The time at which the command ends.
   */
  endTime = 0;

  /**
   * Starting value of this command.
   */
  declare startValue: T;

  /**
   * Ending value of this command.
   */
  declare endValue: T;

  constructor(type: CommandType, easing: Easing, startTime: number, endTime: number, startValue: T, endValue: T) {
    this.type = type;
    this.easing = easing;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startValue = startValue;
    this.endValue = endValue;
  }

  /**
   * The duration of the storyboard command.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * The acronym of the storyboard command.
   * Use {@link type} property directly.
   * @deprecated Since 0.10.0
   */
  get acronym(): string {
    return this.type;
  }

  /**
   * @param other Other storyboard command.
   * @returns If two storyboard commands are equal.
   */
  equals(other: Command<T>): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }
}
