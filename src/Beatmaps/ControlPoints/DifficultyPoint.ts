import { clamp } from '../../Utils/MathUtils';
import { ControlPointType } from '../Enums/ControlPointType';
import { ControlPoint } from './ControlPoint';

/**
 * A difficulty point.
 */
export class DifficultyPoint extends ControlPoint {
  /**
   * The default instance of a difficulty point.
   */
  static default: DifficultyPoint = new DifficultyPoint();

  /**
   * The type of a difficulty point.
   */
  pointType: ControlPointType = ControlPointType.DifficultyPoint;

  /**
   * Whether or not slider ticks should be generated at this control point.
   * This exists for backwards compatibility with maps that abuse 
   * NaN slider velocity behavior on osu!stable (e.g. /b/2628991).
   */
  generateTicks = true;

  /**
   * Indicates whether this difficulty control point should be considered as legacy or not.
   */
  isLegacy = false;

  private _sliderVelocity = 1;

  /**
   * The slider velocity at this difficulty point.
   */
  get sliderVelocity(): number {
    // Imitate bindable value with range [0.1, 10].
    return clamp(this._sliderVelocity, 0.1, 10);
  }

  set sliderVelocity(value: number) {
    this._sliderVelocity = value;
  }

  /**
   * Legacy BPM multiplier that introduces floating-point 
   * errors for rulesets that depend on it.
   * DO NOT USE THIS UNLESS 100% SURE.
   */
  bpmMultiplier = 1;

  /**
   * Checks if this difficulty point is redundant to an another one.
   * @param existing The another difficulty point.
   * @returns Whether the difficulty point is redundant.
   */
  isRedundant(existing: DifficultyPoint | null): boolean {
    return existing instanceof DifficultyPoint
      && existing.sliderVelocity === this.sliderVelocity
      && existing.generateTicks === this.generateTicks;
  }

  /**
   * @param other Other difficulty control point.
   * @returns If two difficulty control points are equal.
   */
  equals(other: DifficultyPoint): boolean {
    return other instanceof DifficultyPoint
      && this.sliderVelocity === other.sliderVelocity;
  }
}
