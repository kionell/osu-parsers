import { HitObject, IHasColumn, IHasX } from 'osu-resources';

export abstract class ManiaHitObject extends HitObject implements IHasColumn, IHasX {
  protected _originalColumn = 0;

  protected _column = 0;

  get originalColumn(): number {
    return this._originalColumn;
  }

  set originalColumn(value: number) {
    this._originalColumn = value;
    this._column = value;
  }

  get column(): number {
    return this._column;
  }

  set column(value: number) {
    this._column = value;
  }

  get startX(): number {
    return this._column;
  }
}
