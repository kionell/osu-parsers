import { CommandType, Easing } from '../Enums';

/**
 * A storyboard command.
 */
export interface ICommand {
  /**
   * Command type.
   */
  type: CommandType;

  /**
   * The easing of the storyboard command.
   */
  easing: Easing;

  /**
   * The time at which the command starts.
   */
  startTime: number;

  /**
   * The time at which the command ends.
   */
  endTime: number;

  /**
   * The duration of the storyboard command.
   */
  duration: number;
}
