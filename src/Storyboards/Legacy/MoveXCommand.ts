import { Command } from '../Commands/Command';
import { IMovableX } from './Types/IMovableX';
import { CommandType } from '../Enums/CommandType';

/**
 * The X-movement command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class MoveXCommand extends Command<number> implements IMovableX {
  type: CommandType = CommandType.MovementX;

  /**
   * The start X-position of the move command.
   */
  get startX(): number {
    return this.startValue;
  }

  set startX(value: number) {
    this.startValue = value;
  }

  /**
   * The end X-position of the move command.
   */
  get endX(): number {
    return this.endValue;
  }

  set endX(value: number) {
    this.endValue = value;
  }

  /**
   * The acronym of the X-movement command.
   */
  get acronym(): string {
    return 'MX';
  }
}
