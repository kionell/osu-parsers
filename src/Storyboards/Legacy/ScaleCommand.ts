import { Command } from '../Commands/Command';
import { Vector2 } from '../../Utils';
import { IScalable } from './Types/IScalable';
import { CommandType } from '../Enums/CommandType';

/**
 * The scale command.
 * Use generic {@link Command<T>} class instead.
 * @deprecated Since 0.10.0
 */
export class ScaleCommand extends Command<number> implements IScalable {
  type: CommandType = CommandType.Scale;

  private _startScale = new Vector2(1, 1);
  private _endScale = new Vector2(1, 1);

  /**
   * The start scaling of the scale command.
   */
  get startScaling(): number {
    return this.startValue;
  }

  set startScaling(value: number) {
    this.startValue = value;
  }

  /**
   * The end scaling of the scale command.
   */
  get endScaling(): number {
    return this.endValue;
  }

  set endScaling(value: number) {
    this.endValue = value;
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
