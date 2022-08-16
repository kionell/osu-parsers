import { CommandType, ParameterType } from '../Enums';
import { EasingType } from '../Easing';
import { Command } from './Command';

/**
 * A storyboard command timeline.
 */
export class CommandTimeline<T = any> implements Iterable<Command<T>> {
  private readonly _commands: Command<T>[] = [];

  startTime = Infinity;
  endTime = -Infinity;

  declare startValue: T;
  declare endValue: T;

  [Symbol.iterator](): Iterator<Command<T>> {
    const data = this.commands;
    let i = -1;

    return {
      next: () => ({ value: data[++i], done: !(i in data) }),
    };
  }

  /**
   * A command list.
   */
  get commands(): Command<T>[] {
    return this._commands.sort((a, b) => {
      return a.startTime - b.startTime || a.endTime - b.endTime;
    });
  }

  add(
    type: CommandType,
    easing: EasingType,
    startTime: number,
    endTime: number,
    startValue: T,
    endValue: T,
    parameter?: ParameterType,
  ): void {
    if (endTime < startTime) return;

    this._commands.push(new Command<T>({
      type,
      easing,
      startTime,
      endTime,
      startValue,
      endValue,
      parameter,
    }));

    if (startTime < this.startTime) {
      this.startValue = startValue;
      this.startTime = startTime;
    }

    if (endTime > this.endTime) {
      this.endValue = endValue;
      this.endTime = endTime;
    }
  }

  get hasCommands(): boolean {
    return this._commands.length > 0;
  }
}
