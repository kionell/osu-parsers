import { Command } from '../Commands/Command';
import { CommandType } from '../Enums/CommandType';

/**
 * The fade command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class FadeCommand extends Command<number> {
  type: CommandType = CommandType.Fade;

  /**
   * The start opacity of the fade command.
   */
  get startOpacity(): number {
    return this.startValue;
  }

  set startOpacity(value: number) {
    this.startValue = value;
  }

  /**
   * The end opacity of the fade command.
   */
  get endOpacity(): number {
    return this.endValue;
  }

  set endOpacity(value: number) {
    this.endValue = value;
  }

  /**
   * The acronym of the fade command.
   */
  get acronym(): string {
    return 'F';
  }
}
