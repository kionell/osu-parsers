import { Command } from './Command';
import { CommandType } from '../Enums/CommandType';

/**
 * The fade command.
 */
export class FadeCommand extends Command {
  type: CommandType = CommandType.Fade;

  private _startOpacity = 1;

  /**
   * The end opacity of the fade command.
   */
  endOpacity = 1;

  /**
   * The start opacity of the fade command.
   */
  get startOpacity(): number {
    return this._startOpacity;
  }

  set startOpacity(value: number) {
    this._startOpacity = value;
    this.endOpacity = value;
  }

  /**
   * The acronym of the fade command.
   */
  get acronym(): string {
    return 'F';
  }
}
