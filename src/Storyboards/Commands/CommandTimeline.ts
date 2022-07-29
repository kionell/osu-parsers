import { CommandType, Easing, ParameterType } from '../Enums';
import { Command } from './Command';

import {
  BlendingCommand,
  ColourCommand,
  FadeCommand,
  HorizontalFlipCommand,
  MoveCommand,
  MoveXCommand,
  MoveYCommand,
  RotateCommand,
  ScaleCommand,
  VectorScaleCommand,
  VerticalFlipCommand,
} from '../Legacy';

interface ITimelineAddFunction<T> {
  (
    type: CommandType,
    easing: Easing,
    startTime: number,
    endTime: number,
    startValue: T,
    endValue: T,
  ): void;

  /**
   * @deprecated Since 1.0.0
   */
  (
    type: CommandType,
    easing: Easing,
    startTime: number,
    endTime: number,
    startValue: T,
    endValue: T,
    parameter?: ParameterType,
  ): void;
}

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
    return this._commands.sort((a, b) => a.startTime - b.startTime);
  }

  add: ITimelineAddFunction<T> = (
    type: CommandType,
    easing: Easing,
    startTime: number,
    endTime: number,
    startValue: T,
    endValue: T,
    parameter?: ParameterType,
  ): void => {
    if (endTime < startTime) return;

    this._commands.push(this._createCommand(
      type,
      easing,
      startTime,
      endTime,
      startValue,
      endValue,
      parameter,
    ));

    if (startTime < this.startTime) {
      this.startValue = startValue;
      this.startTime = startTime;
    }

    if (endTime > this.endTime) {
      this.endValue = endValue;
      this.endTime = endTime;
    }
  };

  get hasCommands(): boolean {
    return this._commands.length > 0;
  }

  /**
   * TODO: Remove this later.
   */
  private _createCommand(
    type: CommandType,
    easing: Easing,
    startTime: number,
    endTime: number,
    startValue: any,
    endValue: any,
    parameter?: ParameterType,
  ): Command {
    switch (type) {
      case CommandType.Fade:
        return new FadeCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.Scale:
        return new ScaleCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.VectorScale:
        return new VectorScaleCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.Rotation:
        return new RotateCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.Movement:
        return new MoveCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.MovementX:
        return new MoveXCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.MovementY:
        return new MoveYCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.Colour:
        return new ColourCommand(type, easing, startTime, endTime, startValue, endValue);

      case CommandType.Parameter: {
        switch (parameter) {
          case ParameterType.BlendingMode:
            return new BlendingCommand(type, easing, startTime, endTime, startValue, endValue);

          case ParameterType.HorizontalFlip:
            return new HorizontalFlipCommand(type, easing, startTime, endTime, startValue, endValue);

          case ParameterType.VerticalFlip:
            return new VerticalFlipCommand(type, easing, startTime, endTime, startValue, endValue);
        }
      }
    }

    return new Command<T>(type, easing, startTime, endTime, startValue, endValue);
  }
}
