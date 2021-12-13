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
  ColourCommand,
  ParameterCommand,
  HorizontalFlipCommand,
  VerticalFlipCommand,
  BlendingCommand,
  EventType,
  LayerType,
  Origins,
  LoopType,
  CommandType,
  ParameterType,
} from 'osu-classes';

/**
 * A decoder for storyboard elements, compounds and commands.
 */
export abstract class StoryboardHandler {
  /**
   * Decodes a storyboard line to get an element.
   * @param line Storyboard line.
   * @returns A new storyboard element.
   */
  static handleElement(line: string): IStoryboardElement {
    const data = line.split(',');

    let eventType: EventType = parseInt(data[0]);

    eventType = isFinite(eventType) ? eventType : (EventType as any)[data[0]];

    const index = eventType === EventType.Sample ? 2 : 1;

    let layerType: LayerType = parseInt(data[index]);

    layerType = isFinite(parseInt(data[index]))
      ? layerType
      : (LayerType as any)[data[index]];

    switch (eventType) {
      case EventType.Sprite: {
        const element = new StoryboardSprite();

        element.layer = layerType;
        element.filePath = data[3].replace(/"/g, '');
        element.startX = parseInt(data[4]);
        element.startY = parseInt(data[5]);
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
        element.startX = parseInt(data[4]);
        element.startY = parseInt(data[5]);
        element.frames = parseInt(data[6]);
        element.frameDelay = parseInt(data[7]);
        element.loop = parseInt(data[8]);
        element.loop = isFinite(element.loop)
          ? element.loop
          : (LoopType as any)[data[8]];

        return element;
      }

      case EventType.Sample: {
        const element = new StoryboardSample();

        element.layer = layerType;
        element.startTime = parseInt(data[1]);
        element.filePath = data[3].replace(/"/g, '');
        element.volume = data.length > 4 ? parseInt(data[4]) : 100;

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

    loop.loopStartTime = parseInt(data[1]);
    loop.loopCount = parseInt(data[2]);

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
    trigger.startTime = parseInt(data[2]) || 0;
    trigger.endTime = parseInt(data[3]) || 0;
    trigger.groupNumber = parseInt(data[4]) || 0;

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
        (command as FadeCommand).startOpacity = parseFloat(data[4]);

        if (data.length > 5) {
          (command as FadeCommand).endOpacity = parseFloat(data[5]);
        }

        break;

      case CommandType.Movement:
        command = new MoveCommand();
        (command as MoveCommand).startX = parseFloat(data[4]);
        (command as MoveCommand).startY = parseFloat(data[5]);

        if (data.length > 6) {
          (command as MoveCommand).endX = parseFloat(data[6]);
          (command as MoveCommand).endY = parseFloat(data[7]);
        }

        break;

      case CommandType.MovementX:
        command = new MoveXCommand();
        (command as MoveXCommand).startX = parseFloat(data[4]);

        if (data.length > 5) {
          (command as MoveXCommand).endX = parseFloat(data[5]);
        }

        break;

      case CommandType.MovementY:
        command = new MoveYCommand();
        (command as MoveYCommand).startY = parseFloat(data[4]);

        if (data.length > 5) {
          (command as MoveYCommand).endY = parseFloat(data[5]);
        }

        break;

      case CommandType.Scale:
        command = new ScaleCommand();
        (command as ScaleCommand).startScaling = parseFloat(data[4]);

        if (data.length > 5) {
          (command as ScaleCommand).endScaling = parseFloat(data[5]);
        }

        break;

      case CommandType.VectorScale:
        command = new VectorScaleCommand();
        (command as VectorScaleCommand).startScaleX = parseFloat(data[4]);
        (command as VectorScaleCommand).startScaleY = parseFloat(data[5]);

        if (data.length > 6) {
          (command as VectorScaleCommand).endScaleX = parseFloat(data[6]);
          (command as VectorScaleCommand).endScaleY = parseFloat(data[7]);
        }

        break;

      case CommandType.Rotation:
        command = new RotateCommand();
        (command as RotateCommand).startRotate = parseFloat(data[4]);

        if (data.length > 5) {
          (command as RotateCommand).endRotate = parseFloat(data[5]);
        }

        break;

      case CommandType.Colour:
        command = new ColourCommand();
        (command as ColourCommand).startRed = parseInt(data[4]);
        (command as ColourCommand).startGreen = parseInt(data[5]);
        (command as ColourCommand).startBlue = parseInt(data[6]);

        if (data.length > 7) {
          (command as ColourCommand).endRed = parseInt(data[7]);
          (command as ColourCommand).endGreen = parseInt(data[8]);
          (command as ColourCommand).endBlue = parseInt(data[9]);
        }

        break;

      default:
        command = StoryboardHandler.handleParameterCommand(data);
    }

    command.easing = parseInt(data[1]);
    command.startTime = parseInt(data[2]);
    command.endTime = parseInt(data[3]);

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

    command.easing = parseInt(data[1]);
    command.startTime = parseInt(data[2]);
    command.endTime = parseInt(data[3]);

    return command;
  }
}
