import { Vector2 } from '../../Utils';
import { Command } from '../Commands/Command';
import { IScalable } from './Types/IScalable';
import { CommandType } from '../Enums/CommandType';

/**
 * The vector scale command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class VectorScaleCommand extends Command<Vector2> implements IScalable {
  type: CommandType = CommandType.VectorScale;

  private _startScale: Vector2 = new Vector2(1, 1);
  private _endScale: Vector2 = new Vector2(1, 1);

  /**
   * The start X-scale value of the vector scale command.
   */
  get startScaleX(): number {
    return this.startValue.x;
  }

  set startScaleX(value: number) {
    this.startValue.x = value;
  }

  /**
   * The start Y-scale value of the vector scale command.
   */
  get startScaleY(): number {
    return this.startValue.y;
  }

  set startScaleY(value: number) {
    this.startValue.y = value;
  }

  /**
   * The end X-scale value of the vector scale command.
   */
  get endScaleX(): number {
    return this.endValue.x;
  }

  set endScaleX(value: number) {
    this.endValue.x = value;
  }

  /**
   * The end Y-scale value of the vector scale command.
   */
  get endScaleY(): number {
    return this.endValue.y;
  }

  set endScaleY(value: number) {
    this.endValue.y = value;
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
