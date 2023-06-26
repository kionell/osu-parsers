import {
  Storyboard,
  StoryboardVideo,
  StoryboardSprite,
  StoryboardAnimation,
  StoryboardSample,
  StoryboardLayer,
  IStoryboardElement,
  IHasCommands,
  CommandTimelineGroup,
  CommandLoop,
  CommandTrigger,
  Origins,
  Command,
  CommandType,
  LayerType,
  Vector2,
  Color4,
} from 'osu-classes';

/**
 * An encoder for beatmap events & storyboard.
 */
export abstract class StoryboardEventEncoder {
  /**
   * Encodes storyboard events.
   * @param storyboard A storyboard.
   * @returns Encoded storyboard events.
   */
  static encodeEventSection(storyboard: Storyboard): string {
    const encoded: string[] = [
      '[Events]',
      this.encodeStoryboard(storyboard),
    ];

    return encoded.join('\n');
  }

  /**
   * Encodes storyboard videos.
   * @param storyboard A storyboard.
   * @returns Encoded storyboard videos.
   */
  static encodeVideos(storyboard: Storyboard): string {
    const encoded: string[] = [];

    const video = storyboard.getLayerByType(LayerType.Video);

    if (video.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(video));
    }

    return encoded.join('\n');
  }

  /**
   * Encodes a storyboard.
   * @param storyboard The storyboard.
   * @returns Encoded storyboard.
   */
  static encodeStoryboard(storyboard: Storyboard): string {
    const encoded: string[] = [];

    encoded.push('//Storyboard Layer 0 (Background)');

    const background = storyboard.getLayerByType(LayerType.Background);

    if (background.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(background));
    }

    encoded.push('//Storyboard Layer 1 (Fail)');

    const fail = storyboard.getLayerByType(LayerType.Fail);

    if (fail.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(fail));
    }

    encoded.push('//Storyboard Layer 2 (Pass)');

    const pass = storyboard.getLayerByType(LayerType.Pass);

    if (pass.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(pass));
    }

    encoded.push('//Storyboard Layer 3 (Foreground)');

    const foreground = storyboard.getLayerByType(LayerType.Foreground);

    if (foreground.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(foreground));
    }

    encoded.push('//Storyboard Layer 4 (Overlay)');

    const overlay = storyboard.getLayerByType(LayerType.Overlay);

    if (overlay.elements.length > 0) {
      encoded.push(this.encodeStoryboardLayer(overlay));
    }

    return encoded.join('\n');
  }

  /**
   * Encodes storyboard layer.
   * @param layer A storyboard layer.
   * @returns Encoded storyboard layer.
   */
  static encodeStoryboardLayer(layer: StoryboardLayer): string {
    const encoded: string[] = [];

    layer.elements.forEach((element) => {
      encoded.push(this.encodeStoryboardElement(element, layer.name));

      const elementWithCommands = element as IStoryboardElement & IHasCommands;

      elementWithCommands?.loops?.forEach((loop) => {
        if (loop.commands.length > 0) {
          encoded.push(this.encodeCompound(loop));
          encoded.push(this.encodeTimelineGroup(loop, 2));
        }
      });

      if (elementWithCommands?.timelineGroup?.commands.length > 0) {
        encoded.push(this.encodeTimelineGroup(elementWithCommands.timelineGroup));
      }

      elementWithCommands?.triggers?.forEach((trigger) => {
        if (trigger.commands.length > 0) {
          encoded.push(this.encodeCompound(trigger));
          encoded.push(this.encodeTimelineGroup(trigger, 2));
        }
      });
    });

    return encoded.join('\n');
  }

  /**
   * Encodes storyboard element.
   * @param element A storyboard element.
   * @param layer Layer name.
   * @returns Encoded storyboard element.
   */
  static encodeStoryboardElement(element: IStoryboardElement, layer: string): string {
    if (element instanceof StoryboardAnimation) {
      return [
        'Animation',
        layer,
        Origins[element.origin],
        `"${element.filePath}"`,
        element.startPosition,
        element.frameCount,
        element.frameDelay,
        element.loopType,
      ].join(',');
    }

    if (element instanceof StoryboardSprite) {
      return [
        'Sprite',
        layer,
        Origins[element.origin],
        `"${element.filePath}"`,
        element.startPosition,
      ].join(',');
    }

    if (element instanceof StoryboardSample) {
      return [
        'Sample',
        element.startTime,
        layer,
        `"${element.filePath}"`,
        element.volume,
      ].join(',');
    }

    if (element instanceof StoryboardVideo) {
      return [
        'Video',
        element.startTime,
        element.filePath,
        '0,0', // Offset of the video.
      ].join(',');
    }

    return '';
  }

  /**
   * Encodes storyboard compounded command.
   * @param compound A storyboard compounded command.
   * @param depth Indentation level of this timeline group.
   * @returns Encoded storyboard compounded command.
   */
  static encodeCompound(compound: CommandTimelineGroup, depth = 1): string {
    const indentation = ''.padStart(depth, ' ');

    if (compound instanceof CommandLoop) {
      return indentation + [
        compound.type,
        compound.loopStartTime,
        compound.totalIterations,
      ].join(',');
    }

    if (compound instanceof CommandTrigger) {
      return indentation + [
        compound.type,
        compound.triggerName,
        compound.triggerStartTime,
        compound.triggerEndTime,
        compound.groupNumber,
      ].join(',');
    }

    return '';
  }

  /**
   * Encodes a storyboard timeline group.
   * @param timelineGroup A storyboard timeline group.
   * @param depth Indentation level of this timeline group.
   * @returns Encoded storyboard timeline group.
   */
  static encodeTimelineGroup(timelineGroup: CommandTimelineGroup, depth = 1): string {
    const indentation = ''.padStart(depth, ' ');
    const encoded: string[] = [];

    const commands = timelineGroup.commands;

    let shouldSkip = false;

    for (let i = 0; i < commands.length; ++i) {
      if (shouldSkip) {
        shouldSkip = false;
        continue;
      }

      /**
       * We need at least 2 commands for move command.
       */
      if (i < commands.length - 1) {
        const current = commands[i];
        const next = commands[i + 1];

        const currentMoveX = current.type === CommandType.MovementX;
        const nextMoveY = next.type === CommandType.MovementY;
        const sameEasing = current.easing === next.easing;
        const sameStartTime = current.startTime === next.startTime;
        const sameEndTime = current.endTime === next.endTime;
        const sameCommand = sameEasing && sameStartTime && sameEndTime;

        if (currentMoveX && nextMoveY && sameCommand) {
          encoded.push(indentation + this.encodeMoveCommand(current, next));

          /**
           * Skip next command because we already encoded it.
           */
          shouldSkip = true;

          continue;
        }
      }

      /**
       * This can be either a movement command or a completely different command.
       */
      encoded.push(indentation + this.encodeCommand(commands[i]));
    }

    return encoded.join('\n');
  }

  /**
   * Combines two split X & Y commands into one single move command. 
   * @param moveX Command from 'x' timeline.
   * @param moveY Command from 'y' timeline.
   * @returns Encoded move command.
   */
  static encodeMoveCommand(moveX: Command<number>, moveY: Command<number>): string {
    const encoded = [
      CommandType.Movement,
      moveX.easing,
      moveX.startTime,
      moveX.startTime !== moveX.endTime ? moveX.endTime : '',
      moveX.startValue,
      moveY.startValue,
    ];

    const equalX = moveX.startValue === moveX.endValue;
    const equalY = moveY.startValue === moveY.endValue;

    if (!equalX || !equalY) {
      encoded.push(`${moveX.endValue},${moveY.endValue}`);
    }

    return encoded.join(',');
  }

  /**
   * Encodes storyboard command.
   * @param command A storyboard command.
   * @returns Encoded storyboard command.
   */
  static encodeCommand(command: Command): string {
    const encoded = [
      command.type,
      command.easing,
      command.startTime,
      command.startTime !== command.endTime ? command.endTime : '',
      this._encodeCommandParams(command),
    ];

    return encoded.join(',');
  }

  private static _encodeCommandParams(command: Command): string {
    if (command.type === CommandType.Parameter) {
      return command.parameter;
    }

    if (command.type === CommandType.Color) {
      const toRGB = (c: Color4) => `${c.red},${c.green},${c.blue}`;

      const colorCommand = command as Command<Color4>;
      const start = colorCommand.startValue;
      const end = colorCommand.endValue;

      return this._areValuesEqual(command)
        ? toRGB(start) : toRGB(start) + ',' + toRGB(end);
    }

    return this._areValuesEqual(command)
      ? `${command.startValue}`
      : `${command.startValue},${command.endValue}`;
  }

  private static _areValuesEqual(command: Command): boolean {
    if (command.type === CommandType.VectorScale) {
      const vectorCommand = command as Command<Vector2>;

      return vectorCommand.startValue.equals(vectorCommand.endValue);
    }

    if (command.type === CommandType.Color) {
      const colorCommand = command as Command<Color4>;

      return colorCommand.startValue.equals(colorCommand.endValue);
    }

    return command.startValue === command.endValue;
  }
}
