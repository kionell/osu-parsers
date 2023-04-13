import { clamp } from '../../Utils/MathUtils';
import { ControlPointType } from '../Enums/ControlPointType';
import { ControlPoint } from './ControlPoint';

/**
 * An effect point.
 */
export class EffectPoint extends ControlPoint {
  /**
   * The default instance of an effect point.
   */
  static default: EffectPoint = new EffectPoint();

  /**
   * The type of an effect point.
   */
  pointType: ControlPointType = ControlPointType.EffectPoint;

  /**
   * Whether this control point enables kiai mode.
   */
  kiai = false;

  /**
   * Whether the first bar line of this control point is ignored.
   */
  omitFirstBarLine = false;

  /**
   * The relative scroll speed at this control point.
   */
  private _scrollSpeed = 1;

  get scrollSpeed(): number {
    return clamp(this._scrollSpeed, 0.1, 10);
  }

  set scrollSpeed(value: number) {
    this._scrollSpeed = value;
  }

  /**
   * Checks if this effect point is redundant to an another one.
   * @param existing The another effect point.
   * @returns Whether the effect point is redundant.
   */
  isRedundant(existing: EffectPoint | null): boolean {
    return (
      !this.omitFirstBarLine
        && existing !== null
        && this.kiai === existing.kiai
        && this.omitFirstBarLine === existing.omitFirstBarLine
        && this.scrollSpeed === existing.scrollSpeed
    );
  }

  /**
   * @param other Other effect control point.
   * @returns If two effect control points are equal.
   */
  equals(other: EffectPoint): boolean {
    return other instanceof EffectPoint
      && this.kiai === other.kiai
      && this.omitFirstBarLine === other.omitFirstBarLine
      && this.scrollSpeed === other.scrollSpeed;
  }
}
