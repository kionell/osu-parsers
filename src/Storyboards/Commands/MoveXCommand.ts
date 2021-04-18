import { Command } from './Command';
import { IMovableX } from './Types/IMovableX';
import { CommandType } from '../Enums/CommandType';

/**
 * The X-movement command.
 */
export class MoveXCommand extends Command implements IMovableX {
  type: CommandType = CommandType.MovementX;

  private _startX = 0;

  /**
   * The end X-position of the X-movement command.
   */
  endX = 0;

  /**
   * The start X-position of the X-movement command.
   */
  get startX(): number {
    return this._startX;
  }

  set startX(value: number) {
    this._startX = value;
    this.endX = value;
  }

  /**
   * The acronym of the X-movement command.
   */
  get acronym(): string {
    return 'MX';
  }
}
