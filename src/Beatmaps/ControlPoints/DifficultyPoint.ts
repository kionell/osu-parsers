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
   * The speed multiplier of this difficulty point.
   */
  speedMultiplier = 1;

  /**
   * The bpm multiplier of this difficulty point.
   */
  bpmMultiplier = 1;

  /**
   * Checks if this difficulty point is redundant to an another one.
   * @param existing The another difficulty point.
   * @returns Whether the difficulty point is redundant.
   */
  isRedundant(existing: DifficultyPoint | null): boolean {
    return existing !== null
      && existing.speedMultiplier === this.speedMultiplier;
  }
}
