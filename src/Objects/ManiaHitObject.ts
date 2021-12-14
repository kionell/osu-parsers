import { HitObject, IHasColumn, IHasX } from 'osu-resources';

export abstract class ManiaHitObject extends HitObject implements IHasColumn, IHasX {
  protected _originalColumn = 0;

  protected _column = 0;

  /**
   * The original column of this hit object before any changes.
   */
  get originalColumn(): number {
    return this._originalColumn;
  }

  set originalColumn(value: number) {
    this._originalColumn = value;
    this._column = value;
  }

  /**
   * The column of this hit object.
   */
  get column(): number {
    return this._column;
  }

  set column(value: number) {
    this._column = value;
  }

  /**
   * The starting X-position of the hit object.
   */
  get startX(): number {
    return this._column;
  }

  /**
   * The ending X-position of the hit object.
   */
  get endX(): number {
    return this.startX;
  }
}
