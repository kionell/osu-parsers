import { Vector2 } from '../../Utils';

import { Command } from './Command';
import { IScalable } from './Types/IScalable';
import { CommandType } from '../Enums/CommandType';

/**
 * The vector scale command.
 */
export class VectorScaleCommand extends Command implements IScalable {
  type: CommandType = CommandType.VectorScale;

  private _startScaleX = 1;

  private _startScaleY = 1;

  /**
   * The end X-scale value of the vector scale command.
   */
  endScaleX = 1;

  /**
   * The end Y-scale value of the vector scale command.
   */
  endScaleY = 1;

  private _startScale: Vector2 = new Vector2(1, 1);

  private _endScale: Vector2 = new Vector2(1, 1);

  /**
   * The start X-scale value of the vector scale command.
   */
  get startScaleX(): number {
    return this._startScaleX;
  }

  set startScaleX(value: number) {
    this._startScaleX = value;
    this.endScaleX = value;
  }

  /**
   * The start Y-scale value of the vector scale command.
   */
  get startScaleY(): number {
    return this._startScaleY;
  }

  set startScaleY(value: number) {
    this._startScaleY = value;
    this.endScaleY = value;
  }

  /**
   * The start scale vector of the vector scale command.
   */
  get startScale(): Vector2 {
    this._startScale.x = this.startScaleX;
    this._startScale.y = this.startScaleY;

    return this._startScale;
  }

  /**
   * The end scale vector of the vector scale command.
   */
  get endScale(): Vector2 {
    this._endScale.x = this.endScaleX;
    this._endScale.y = this.endScaleY;

    return this._endScale;
  }

  /**
   * The acronym of the vector scale command.
   */
  get acronym(): string {
    return 'V';
  }
}
