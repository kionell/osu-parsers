import { ControlPointType } from '../Enums/ControlPointType';
import { ControlPoint } from './ControlPoint';
import { TimeSignature } from '../Enums/TimeSignature';
import { clamp } from '../../Utils/MathUtils';

/**
 * A timing point.
 */
export class TimingPoint extends ControlPoint {
  /**
   * The default instance of a timing point.
   */
  static default: TimingPoint = new TimingPoint();

  /**
   * Default length of a beat in milliseconds. 
   * Used whenever there is no beatmap or track playing.
   */
  static DEFAULT_BEAT_LENGTH = 1000;

  /**
   * The type of a timing point.
   */
  pointType: ControlPointType = ControlPointType.TimingPoint;

  /**
   * The real beat length of this timing point 
   * without any limits as it was in osu!stable.
   * Usage of {@link beatLength} is preferable when working with osu!lazer.
   */
  beatLengthUnlimited = TimingPoint.DEFAULT_BEAT_LENGTH;

  /**
   * The beat length of this timing point.
   */
  get beatLength(): number {
    return clamp(this.beatLengthUnlimited, 6, 60000);
  }

  set beatLength(value: number) {
    this.beatLengthUnlimited = value;
  }

  /**
   * The time signature of this timing point.
   */
  timeSignature: TimeSignature = TimeSignature.SimpleQuadruple;

  /**
   * The real BPM of this timing point 
   * without any limits as it was in osu!stable.
   * Usage of {@link bpm} is preferable when working with osu!lazer.
   */
  get bpmUnlimited(): number {
    return 60000 / this.beatLengthUnlimited;
  }

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

  /**
   * @param other Other timing control point.
   * @returns If two timing control points are equal.
   */
  equals(other: TimingPoint): boolean {
    return other instanceof TimingPoint
      && this.timeSignature === other.timeSignature
      && this.beatLength === other.beatLength;
  }
}
