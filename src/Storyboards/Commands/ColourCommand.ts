import { Colour } from '../../Utils';

import { Command } from './Command';
import { CommandType } from '../Enums/CommandType';

/**
 * The colour command.
 */
export class ColourCommand extends Command {
  type: CommandType = CommandType.Colour;

  private _startRed = 0;

  private _startGreen = 0;

  private _startBlue = 0;

  /**
   * The value of red colour to which the change will be made.
   */
  endRed = 0;

  /**
   * The value of green colour to which the change will be made.
   */
  endGreen = 0;

  /**
   * The value of blue colour to which the change will be made.
   */
  endBlue = 0;

  private _startColour: Colour = new Colour();

  private _endColour: Colour = new Colour();

  /**
   * The start value of red colour the command.
   */
  get startRed(): number {
    return this._startRed;
  }

  set startRed(value: number) {
    this._startRed = value;
    this.endRed = value;
  }

  /**
   * The start value of green colour the command.
   */
  get startGreen(): number {
    return this._startGreen;
  }

  set startGreen(value: number) {
    this._startGreen = value;
    this.endGreen = value;
  }

  /**
   * The start value of blue colour the command.
   */
  get startBlue(): number {
    return this._startBlue;
  }

  set startBlue(value: number) {
    this._startBlue = value;
    this.endBlue = value;
  }

  /**
   * The start colour of the command.
   */
  get startColour(): Colour {
    this._startColour.red = this.startRed;
    this._startColour.green = this.startGreen;
    this._startColour.blue = this.startBlue;

    return this._startColour;
  }

  /**
   * The end colour of the command.
   */
  get endColour(): Colour {
    this._endColour.red = this.endRed;
    this._endColour.green = this.endGreen;
    this._endColour.blue = this.endBlue;

    return this._endColour;
  }

  /**
   * The acronym of the colour command.
   */
  get acronym(): string {
    return 'C';
  }
}
