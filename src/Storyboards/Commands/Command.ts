import { CommandType, ParameterType } from '../Enums';
import { Easing, EasingType } from '../Easing';
import { Color4, Vector2 } from '../../Types';
import { BlendingParameters } from '../Blending';
import { map01 } from '../../Utils/MathUtils';

/**
 * A storyboard command.
 */
export class Command<T = any> {
  /**
   * Command type.
   */
  type: CommandType;

  /**
   * Command type.
   */
  parameter: ParameterType;

  /**
   * The easing of the storyboard command.
   */
  easing: EasingType;

  /**
   * The time at which the command starts.
   */
  startTime: number;

  /**
   * The time at which the command ends.
   */
  endTime: number;

  /**
   * Starting value of this command.
   */
  declare startValue: T;

  /**
   * Ending value of this command.
   */
  declare endValue: T;

  constructor(params?: Partial<Command>) {
    this.type = params?.type ?? CommandType.None;
    this.parameter = params?.parameter ?? ParameterType.None;
    this.easing = params?.easing ?? EasingType.None;
    this.startTime = params?.startTime ?? 0;
    this.endTime = params?.endTime ?? 0;
    this.startValue = params?.startValue ?? null;
    this.endValue = params?.endValue ?? null;
  }

  /**
   * The duration of the storyboard command.
   */
  get duration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * Calculates the progress of this command.
   * @param time Current time in milliseconds.
   * @returns Progress of this command in range from 0 to 1.
   */
  getProgress(time: number): number {
    const clamped = map01(time, this.startTime, this.endTime);

    return Easing.getEasingFn(this.easing)(clamped);
  }

  /**
   * Calculates the value of this command at a given progress.
   * @param progress Current progress in range from 0 to 1.
   * @returns Calculated value.
   */
  getValueAtProgress(progress: number): T {
    const getNumber = (progress: number, start: number, end: number) => {
      return start + progress * (end - start);
    };

    const getBoolean = (time: number, start: number, end: number) => {
      return start === end || time >= start && time < end;
    };

    if (typeof this.startValue === 'number') {
      const startValue = this.startValue as T & number;
      const endValue = this.endValue as T & number;

      return getNumber(progress, startValue, endValue) as T & number;
    }

    if (this.startValue instanceof Vector2) {
      const startValue = this.startValue as T & Vector2;
      const endValue = this.endValue as T & Vector2;

      return new Vector2(
        getNumber(progress, startValue.x, endValue.x),
        getNumber(progress, startValue.y, endValue.y),
      ) as T & Vector2;
    }

    if (this.startValue instanceof Color4) {
      const startValue = this.startValue as T & Color4;
      const endValue = this.endValue as T & Color4;

      return new Color4(
        getNumber(progress, startValue.red, endValue.red),
        getNumber(progress, startValue.green, endValue.green),
        getNumber(progress, startValue.blue, endValue.blue),
        getNumber(progress, startValue.alpha, endValue.alpha),
      ) as T & Color4;
    }

    const time = this.startTime + this.duration * progress;

    if (typeof this.startValue === 'boolean') {
      return getBoolean(time, this.startTime, this.endTime) as T & boolean;
    }

    if (this.startValue instanceof BlendingParameters) {
      const startValue = this.startValue as T & BlendingParameters;
      const endValue = this.endValue as T & BlendingParameters;

      const isAdditive = getBoolean(time, this.startTime, this.endTime);

      return isAdditive ? startValue : endValue;
    }

    return this.endValue;
  }

  /**
   * Calculates the value of this command at a given momemnt of time.
   * @param time Current time in milliseconds.
   * @returns Calculated value.
   */
  getValueAtTime(time: number): T {
    return this.getValueAtProgress(this.getProgress(time));
  }

  /**
   * @param other Other storyboard command.
   * @returns If two storyboard commands are equal.
   */
  equals(other: Command<T>): boolean {
    return this.type === other.type
      && this.startTime === other.startTime
      && this.endTime === other.endTime
      && this.startValue === other.startValue
      && this.endValue === other.endValue
      && this.easing === other.easing
      && this.parameter === other.parameter;
  }
}
