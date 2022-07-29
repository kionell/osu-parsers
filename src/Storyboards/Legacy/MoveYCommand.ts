import { Command } from '../Commands/Command';
import { IMovableY } from './Types/IMovableY';
import { CommandType } from '../Enums/CommandType';

/**
 * The Y-movement command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class MoveYCommand extends Command<number> implements IMovableY {
  type: CommandType = CommandType.MovementY;

  /**
   * The start Y-position of the move command.
   */
  get startY(): number {
    return this.startValue;
  }

  set startY(value: number) {
    this.startValue = value;
  }

  /**
   * The end Y-position of the move command.
   */
  get endY(): number {
    return this.endValue;
  }

  set endY(value: number) {
    this.endValue = value;
  }

  /**
   * The acronym of the Y-movement command.
   */
  get acronym(): string {
    return 'MY';
  }
}
