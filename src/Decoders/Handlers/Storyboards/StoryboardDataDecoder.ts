import {
  IStoryboardElement,
  StoryboardSprite,
  StoryboardAnimation,
  StoryboardSample,
  Command,
  CommandLoop,
  CommandTrigger,
  FadeCommand,
  MoveCommand,
  MoveXCommand,
  MoveYCommand,
  ScaleCommand,
  VectorScaleCommand,
  RotateCommand,
  ColorCommand,
  ParameterCommand,
  HorizontalFlipCommand,
  VerticalFlipCommand,
  BlendingCommand,
  EventType,
  LayerType,
  CommandType,
  ParameterType,
  Origins,
  LoopType,
} from 'osu-classes';

import { Parsing } from '../../../Utils';

/**
 * A decoder for storyboard elements, compounds and commands.
 */
export abstract class StoryboardDataDecoder {
  /**
   * Decodes a storyboard line to get an element.
   * @param line Storyboard line.
   * @returns A new storyboard element.
   */
  static handleElement(line: string): IStoryboardElement {
    const data = line.split(',');

    let eventType: EventType = parseInt(data[0]);

    eventType = isFinite(eventType)
      ? eventType
      : (EventType as any)[data[0]];

    const index = eventType === EventType.Sample ? 2 : 1;

    let layerType: LayerType = parseInt(data[index]);

    layerType = isFinite(layerType)
      ? layerType
      : (LayerType as any)[data[index]];

    switch (eventType) {
      case EventType.Sprite: {
        const element = new StoryboardSprite();

        element.layer = layerType;
        element.filePath = data[3].replace(/"/g, '');
        element.startX = Parsing.parseInt(data[4]);
        element.startY = Parsing.parseInt(data[5]);
        element.origin = parseInt(data[2]);
        element.origin = isFinite(element.origin)
          ? element.origin
          : (Origins as any)[data[2]];

        return element;
      }

      case EventType.Animation: {
        const element = new StoryboardAnimation();

        element.layer = layerType;
        element.origin = parseInt(data[2]);
        element.origin = isFinite(element.origin)
          ? element.origin
          : (Origins as any)[data[2]];

        element.filePath = data[3].replace(/"/g, '');
        element.startX = Parsing.parseInt(data[4]);
        element.startY = Parsing.parseInt(data[5]);
        element.frames = Parsing.parseInt(data[6]);
        element.frameDelay = Parsing.parseInt(data[7]);
        element.loop = parseInt(data[8]);
        element.loop = isFinite(element.loop)
          ? element.loop
          : (LoopType as any)[data[8]];

        return element;
      }

      case EventType.Sample: {
        const element = new StoryboardSample();

        element.layer = layerType;
        element.startTime = Parsing.parseInt(data[1]);
        element.filePath = data[3].replace(/"/g, '');
        element.volume = data.length > 4 ? Parsing.parseInt(data[4]) : 100;

        return element;
      }
    }

    // If storyboard element type is unknown.
    return new StoryboardSprite();
  }

  /**
   * Decodes a storyboard line to get a command loop.
   * @param line Storyboard line.
   * @returns A new command loop.
   */
  static handleLoop(line: string): CommandLoop {
    const data = line.split(',');

    const loop = new CommandLoop();

    loop.loopStartTime = Parsing.parseInt(data[1]);
    loop.loopCount = Parsing.parseInt(data[2]);

    return loop;
  }

  /**
   * Decodes a storyboard line to get a command trigger.
   * @param line Storyboard line.
   * @returns A new command trigger.
   */
  static handleTrigger(line: string): CommandTrigger {
    const data = line.split(',');

    const trigger = new CommandTrigger();

    trigger.triggerName = data[1];
    trigger.startTime = Parsing.parseInt(data[2]) || 0;
    trigger.endTime = Parsing.parseInt(data[3]) || 0;
    trigger.groupNumber = Parsing.parseInt(data[4]) || 0;

    return trigger;
  }

  /**
   * Decodes a storyboard line to get a command.
   * @param line Storyboard line.
   * @returns A new command.
   */
  static handleCommand(line: string): Command {
    const data = line.split(',');

    const commandType: CommandType = data[0] as CommandType;

    let command: Command;

    switch (commandType) {
      case CommandType.Fade:
        command = new FadeCommand();
        (command as FadeCommand).startOpacity = Parsing.parseFloat(data[4]);

        if (data.length > 5) {
          (command as FadeCommand).endOpacity = Parsing.parseFloat(data[5]);
        }

        break;

      case CommandType.Movement:
        command = new MoveCommand();
        (command as MoveCommand).startX = Parsing.parseFloat(data[4]);
        (command as MoveCommand).startY = Parsing.parseFloat(data[5]);

        if (data.length > 6) {
          (command as MoveCommand).endX = Parsing.parseFloat(data[6]);
          (command as MoveCommand).endY = Parsing.parseFloat(data[7]);
        }

        break;

      case CommandType.MovementX:
        command = new MoveXCommand();
        (command as MoveXCommand).startX = Parsing.parseFloat(data[4]);

        if (data.length > 5) {
          (command as MoveXCommand).endX = Parsing.parseFloat(data[5]);
        }

        break;

      case CommandType.MovementY:
        command = new MoveYCommand();
        (command as MoveYCommand).startY = Parsing.parseFloat(data[4]);

        if (data.length > 5) {
          (command as MoveYCommand).endY = Parsing.parseFloat(data[5]);
        }

        break;

      case CommandType.Scale:
        command = new ScaleCommand();
        (command as ScaleCommand).startScaling = Parsing.parseFloat(data[4]);

        if (data.length > 5) {
          (command as ScaleCommand).endScaling = Parsing.parseFloat(data[5]);
        }

        break;

      case CommandType.VectorScale:
        command = new VectorScaleCommand();
        (command as VectorScaleCommand).startScaleX = Parsing.parseFloat(data[4]);
        (command as VectorScaleCommand).startScaleY = Parsing.parseFloat(data[5]);

        if (data.length > 6) {
          (command as VectorScaleCommand).endScaleX = Parsing.parseFloat(data[6]);
          (command as VectorScaleCommand).endScaleY = Parsing.parseFloat(data[7]);
        }

        break;

      case CommandType.Rotation:
        command = new RotateCommand();
        (command as RotateCommand).startRotate = Parsing.parseFloat(data[4]);

        if (data.length > 5) {
          (command as RotateCommand).endRotate = Parsing.parseFloat(data[5]);
        }

        break;

      case CommandType.Color:
        command = new ColorCommand();
        (command as ColorCommand).startRed = Parsing.parseInt(data[4]);
        (command as ColorCommand).startGreen = Parsing.parseInt(data[5]);
        (command as ColorCommand).startBlue = Parsing.parseInt(data[6]);

        if (data.length > 7) {
          (command as ColorCommand).endRed = Parsing.parseInt(data[7]);
          (command as ColorCommand).endGreen = Parsing.parseInt(data[8]);
          (command as ColorCommand).endBlue = Parsing.parseInt(data[9]);
        }

        break;

      default:
        command = StoryboardDataDecoder.handleParameterCommand(data);
    }

    command.easing = Parsing.parseInt(data[1]);
    command.startTime = Parsing.parseInt(data[2]);
    command.endTime = Parsing.parseInt(data[3]);

    return command;
  }

  /**
   * Creates a new parameter commands from command data.
   * @param line Command data.
   * @returns A new parameter command.
   */
  static handleParameterCommand(data: string[]): ParameterCommand {
    const parameterType = data[4];

    let command: ParameterCommand;

    switch (parameterType) {
      case ParameterType.HorizontalFlip:
        command = new HorizontalFlipCommand();
        break;

      case ParameterType.VerticalFlip:
        command = new VerticalFlipCommand();
        break;

      default:
        command = new BlendingCommand();
    }

    command.easing = Parsing.parseInt(data[1]);
    command.startTime = Parsing.parseInt(data[2]);
    command.endTime = Parsing.parseInt(data[3]);

    return command;
  }
}
