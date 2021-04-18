import { Vector2 } from '../../Utils';

import { Command } from './Command';
import { IScalable } from './Types/IScalable';
import { CommandType } from '../Enums/CommandType';

/**
 * The scale command.
 */
export class ScaleCommand extends Command implements IScalable {
  type: CommandType = CommandType.Scale;

  private _startScaling = 1;

  /**
   * The end scaling of the scale command.
   */
  endScaling = 1;

  private _startScale: Vector2 = new Vector2(1, 1);

  private _endScale: Vector2 = new Vector2(1, 1);

  /**
   * The start scaling of the scale command.
   */
  get startScaling(): number {
    return this._startScaling;
  }

  set startScaling(value: number) {
    this._startScaling = value;
    this.endScaling = value;
  }

  /**
   * The start scale vector of the scale command.
   */
  get startScale(): Vector2 {
    this._startScale.x = this.startScaling;
    this._startScale.y = this.startScaling;

    return this._startScale;
  }

  /**
   * The end scale vector of the scale command.
   */
  get endScale(): Vector2 {
    this._endScale.x = this.endScaling;
    this._endScale.y = this.endScaling;

    return this._endScale;
  }

  /**
   * The acronym of the scale command.
   */
  get acronym(): string {
    return 'S';
  }
}
