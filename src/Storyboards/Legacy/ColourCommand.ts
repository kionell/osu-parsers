import { Command } from '../Commands/Command';
import { Colour } from '../../Utils';
import { CommandType } from '../Enums/CommandType';

/**
 * The colour command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class ColourCommand extends Command<Colour> {
  type: CommandType = CommandType.Colour;

  /**
   * The start value of red colour the command.
   */
  get startRed(): number {
    return this.startValue.red;
  }

  set startRed(value: number) {
    this.startValue.red = value;
  }

  /**
   * The start value of green colour the command.
   */
  get startGreen(): number {
    return this.startValue.green;
  }

  set startGreen(value: number) {
    this.startValue.green = value;
  }

  /**
   * The start value of blue colour the command.
   */
  get startBlue(): number {
    return this.startValue.blue;
  }

  set startBlue(value: number) {
    this.startValue.blue = value;
  }

  /**
   * The value of red colour to which the change will be made.
   */
  get endRed(): number {
    return this.endValue.red;
  }

  set endRed(value: number) {
    this.endValue.red = value;
  }

  /**
   * The value of green colour to which the change will be made.
   */
  get endGreen(): number {
    return this.endValue.green;
  }

  set endGreen(value: number) {
    this.endValue.green = value;
  }

  /**
   * The value of blue colour to which the change will be made.
   */
  get endBlue(): number {
    return this.endValue.blue;
  }

  set endBlue(value: number) {
    this.endValue.blue = value;
  }

  /**
   * The start colour of the command.
   */
  get startColour(): Colour {
    return this.startValue;
  }

  /**
   * The end colour of the command.
   */
  get endColour(): Colour {
    return this.endValue;
  }

  /**
   * The acronym of the colour command.
   */
  get acronym(): string {
    return 'C';
  }
}
