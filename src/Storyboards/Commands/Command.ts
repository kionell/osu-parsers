import { CommandType } from '../Enums/CommandType';
import { Easing } from '../Enums/Easing';

/**
 * A storyboard command.
 */
export abstract class Command {
  /**
   * The type of the storyboard command.
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

  private _endTime = 0;

  /**
   * The time at which the command ends.
   */
  get endTime(): number {
    return this._endTime || this.startTime;
  }

  set endTime(value: number) {
    this._endTime = value;
  }

  /**
   * The acronym of the storyboard command.
   */
  get acronym(): string {
    return this.type;
  }

  /**
   * The duration of the storyboard command.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }
}
