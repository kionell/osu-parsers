import { Command } from './Command';
import { IMovableY } from './Types/IMovableY';
import { CommandType } from '../Enums/CommandType';

/**
 * The Y-movement command.
 */
export class MoveYCommand extends Command implements IMovableY {
  type: CommandType = CommandType.MovementY;

  private _startY = 0;

  /**
   * The end Y-position of the Y-movement command.
   */
  endY = 0;

  /**
   * The start Y-position of the Y-movement command.
   */
  get startY(): number {
    return this._startY;
  }

  set startY(value: number) {
    this._startY = value;
    this.endY = value;
  }

  /**
   * The acronym of the Y-movement command.
   */
  get acronym(): string {
    return 'MY';
  }
}
