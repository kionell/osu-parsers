import { CommandType, Easing } from '../Enums';
import { ICommand } from './ICommand';

/**
 * A storyboard command.
 */
export class Command<T> implements ICommand {
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
   * @param other Other storyboard command.
   * @returns If two storyboard commands are equal.
   */
  equals(other: ICommand): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }
}
