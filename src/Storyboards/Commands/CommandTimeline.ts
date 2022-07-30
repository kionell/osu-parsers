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

  add(
    type: CommandType,
    easing: Easing,
    startTime: number,
    endTime: number,
    startValue: T,
    endValue: T,
    parameter?: ParameterType,
  ): void {
    if (endTime < startTime) return;

    this._commands.push(this._createCommand({
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

  /**
   * TODO: Remove this later.
   */
  private _createCommand(params: Partial<Command<T>>): Command {
    switch (params.type) {
      case CommandType.Fade: return new FadeCommand(params);
      case CommandType.Scale: return new ScaleCommand(params);
      case CommandType.VectorScale: return new VectorScaleCommand(params);
      case CommandType.Rotation: return new RotateCommand(params);
      case CommandType.Movement: return new MoveCommand(params);
      case CommandType.MovementX: return new MoveXCommand(params);
      case CommandType.MovementY: return new MoveYCommand(params);
      case CommandType.Colour: return new ColourCommand(params);
    }

    if (params.type === CommandType.Parameter) {
      switch (params.parameter) {
        case ParameterType.BlendingMode: return new BlendingCommand(params);
        case ParameterType.HorizontalFlip: return new HorizontalFlipCommand(params);
        case ParameterType.VerticalFlip: return new VerticalFlipCommand(params);
      }
    }

    return new Command<T>(params);
  }
}
