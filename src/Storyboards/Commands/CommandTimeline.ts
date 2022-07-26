import { CommandType, Easing } from '../Enums';
import { Command } from './Command';
import { ICommandTimeline } from './ICommandTimeline';

/**
 * A storyboard command timeline.
 */
export class CommandTimeline<T> implements ICommandTimeline, Iterable<Command<T>> {
  /**
   * A command list.
   */
  readonly commands: Command<T>[] = [];

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

  add(type: CommandType, easing: Easing, startTime: number, endTime: number, startValue: T, endValue: T): void {
    if (endTime < startTime) return;

    this.commands.push(new Command<T>(type, easing, startTime, endTime, startValue, endValue));

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
    return this.commands.length > 0;
  }
}
