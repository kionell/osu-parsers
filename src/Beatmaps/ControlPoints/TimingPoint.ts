import { ControlPointType } from '../Enums/ControlPointType';
import { ControlPoint } from './ControlPoint';
import { TimeSignature } from '../Enums/TimeSignature';

/**
 * A timing point.
 */
export class TimingPoint extends ControlPoint {
  /**
   * The default instance of a timing point.
   */
  static default: TimingPoint = new TimingPoint();

  /**
   * The type of a timing point.
   */
  pointType: ControlPointType = ControlPointType.TimingPoint;

  /**
   * The beat length of this timing point. 
   */
  beatLength = 0;

  /**
   * The time signature of this timing point.
   */
  timeSignature: TimeSignature = TimeSignature.SimpleQuadruple;

  /**
   * The BPM of this timing point. 
   */
  get bpm(): number {
    return 60000 / this.beatLength;
  }

  /**
   * Timing points are never redundant as they can change the time signature.
   */
  isRedundant(): false {
    return false;
  }
}
