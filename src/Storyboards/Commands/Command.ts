import { CommandType, Easing, ParameterType } from '../Enums';

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
  easing: Easing;

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
    this.easing = params?.easing ?? Easing.None;
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
   * The acronym of the storyboard command.
   * Use {@link type} property directly.
   * @deprecated Since 0.10.0
   */
  get acronym(): string {
    return this.type;
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
