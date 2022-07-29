import { Command } from '../Commands/Command';
import { CommandType } from '../Enums/CommandType';

/**
 * The rotate command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class RotateCommand extends Command<number> {
  type: CommandType = CommandType.Rotation;

  /**
   * The start rotating value of the rotate command.
   */
  get startRotate(): number {
    return this.startValue;
  }

  set startRotate(value: number) {
    this.startValue = value;
  }

  /**
   * The end rotating value of the rotate command.
   */
  get endRotate(): number {
    return this.endValue;
  }

  set endRotate(value: number) {
    this.endValue = value;
  }

  /**
   * The acronym of the rotate command.
   */
  get acronym(): string {
    return 'R';
  }
}
