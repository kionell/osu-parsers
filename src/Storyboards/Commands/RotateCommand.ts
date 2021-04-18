import { Command } from './Command';
import { CommandType } from '../Enums/CommandType';

/**
 * The rotate command.
 */
export class RotateCommand extends Command {
  type: CommandType = CommandType.Rotation;

  private _startRotate = 0;

  /**
   * The end rotating value of the rotate command.
   */
  endRotate = 0;

  /**
   * The start rotating value of the rotate command.
   */
  get startRotate(): number {
    return this._startRotate;
  }

  set startRotate(value: number) {
    this._startRotate = value;
    this.endRotate = value;
  }

  /**
   * The acronym of the rotate command.
   */
  get acronym(): string {
    return 'R';
  }
}
