import {
  IBeatmap,
  Storyboard,
  StoryboardSprite,
  StoryboardAnimation,
  StoryboardSample,
  Compound,
  CommandLoop,
  CommandTrigger,
  Command,
  VectorScaleCommand,
  MoveCommand,
  FadeCommand,
  RotateCommand,
  ColourCommand,
  ParameterCommand,
  IHasCommands,
  IStoryboardElement,
  CommandType,
  ParameterType,
  LayerType,
  Origins,
} from 'osu-classes';

/**
 * An encoder for beatmap events & storyboard.
 */
export abstract class EventsEncoder {
  /**
   * Encodes a beatmap's event section
   * @param beatmap A beatmap.
   * @returns A single string with encoded events.
   */
  static encodeEventsSection(beatmap: IBeatmap): string {
    const encoded: string[] = [];

    const events = beatmap.events;
    const storyboard = events.storyboard;

    encoded.push('[Events]');

    encoded.push('//Background and Video events');

    if (events.background) {
      encoded.push(`0,0,"${events.background}",0,0`);
    }

    if (events.video) {
      encoded.push(`Video,${events.videoOffset},"${events.video}"`);
    }

    encoded.push('//Break Periods');

    if (events.breaks && events.breaks.length > 0) {
      events.breaks.forEach((b) => {
        encoded.push(`2,${b.startTime},${b.endTime}`);
      });
    }

    encoded.push('//Storyboard Layer 0 (Background)');

    if (storyboard && storyboard.background.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.background));
    }

    encoded.push('//Storyboard Layer 1 (Fail)');

    if (storyboard && storyboard.fail.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.fail));
    }

    encoded.push('//Storyboard Layer 2 (Pass)');

    if (storyboard && storyboard.pass.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.pass));
    }

    encoded.push('//Storyboard Layer 3 (Foreground)');

    if (storyboard && storyboard.foreground.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.foreground));
    }

    encoded.push('//Storyboard Layer 4 (Overlay)');

    if (storyboard && storyboard.overlay.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.overlay));
    }

    encoded.push('//Storyboard Sound Samples');

    if (storyboard && storyboard.samples.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.samples));
    }

    return encoded.join('\n');
  }

  /**
   * Encodes a storyboard
   * @param storyboard A storyboard.
   * @returns Encoded storyboard.
   */
  static encodeStoryboard(storyboard: Storyboard): string {
    const encoded: string[] = [];

    encoded.push('[Events]');
    encoded.push('//Background and Video events');

    encoded.push('//Storyboard Layer 0 (Background)');

    if (storyboard.background.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.background));
    }

    encoded.push('//Storyboard Layer 1 (Fail)');

    if (storyboard.fail.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.fail));
    }

    encoded.push('//Storyboard Layer 2 (Pass)');

    if (storyboard.pass.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.pass));
    }

    encoded.push('//Storyboard Layer 3 (Foreground)');

    if (storyboard.foreground.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.foreground));
    }

    encoded.push('//Storyboard Layer 4 (Overlay)');

    if (storyboard.overlay.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.overlay));
    }

    encoded.push('//Storyboard Sound Samples');

    if (storyboard.samples.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.samples));
    }

    const variables = Object.entries(storyboard.variables);

    for (let i = 0; i < encoded.length; ++i) {
      variables.forEach((pair) => encoded[i].replace(pair[1], pair[0]));
    }

    return encoded.join('\n');
  }

  /**
   * Encodes storyboard layer.
   * @param layer A storyboard layer.
   * @returns Encoded storyboard layer.
   */
  static encodeStoryboardLayer(layer: IStoryboardElement[]): string {
    const encoded: string[] = [];

    layer.forEach((element) => {
      encoded.push(EventsEncoder.encodeStoryboardElement(element));

      const elementWithCommands = element as IHasCommands;

      if (!elementWithCommands.commands) {
        return;
      }

      elementWithCommands.loops.forEach((loop) => {
        encoded.push(EventsEncoder.encodeCompound(loop));

        loop.commands.forEach((command) => {
          encoded.push(EventsEncoder.encodeCommand(command, true));
        });
      });

      elementWithCommands.commands.forEach((command) => {
        encoded.push(EventsEncoder.encodeCommand(command));
      });

      elementWithCommands.triggers.forEach((trigger) => {
        encoded.push(EventsEncoder.encodeCompound(trigger));

        trigger.commands.forEach((command) => {
          encoded.push(EventsEncoder.encodeCommand(command, true));
        });
      });
    });

    return encoded.join('\n');
  }

  /**
   * Encodes storyboard element.
   * @param element A storyboard element.
   * @returns Encoded storyboard element.
   */
  static encodeStoryboardElement(element: IStoryboardElement): string {
    const encoded: string[] = [];

    if (element instanceof StoryboardSprite) {
      const sprite = element as StoryboardSprite;

      encoded.push('Sprite');
      encoded.push(LayerType[sprite.layer]);
      encoded.push(Origins[sprite.origin]);
      encoded.push(`"${sprite.filePath}"`);
      encoded.push(`${sprite.startPosition}`);
    }
    else if (element instanceof StoryboardAnimation) {
      const animation = element as StoryboardAnimation;

      encoded.push('Animation');
      encoded.push(LayerType[animation.layer]);
      encoded.push(Origins[animation.origin]);
      encoded.push(`"${animation.filePath}"`);
      encoded.push(`${animation.startPosition}`);
      encoded.push(`${animation.frames}`);
      encoded.push(`${animation.frameDelay}`);
      encoded.push(`${animation.loop}`);
    }
    else if (element instanceof StoryboardSample) {
      const sample = element as StoryboardSample;

      encoded.push('Sample');
      encoded.push(`${sample.startTime}`);
      encoded.push(`${sample.layer}`);
      encoded.push(`'${sample.filePath}'`);
      encoded.push(`${sample.volume}`);
    }

    return encoded.join(',');
  }

  /**
   * Encodes storyboard compound.
   * @param compound A storyboard compound.
   * @returns Encoded storyboard compound.
   */
  static encodeCompound(compound: Compound): string {
    const encoded: string[] = [];

    if (compound instanceof CommandLoop) {
      const loop = compound as CommandLoop;

      encoded.push(`${compound.type}`);
      encoded.push(`${loop.startTime}`);
      encoded.push(`${loop.loopCount}`);
    }
    else if (compound instanceof CommandTrigger) {
      const trigger = compound as CommandTrigger;

      encoded.push(`${compound.type}`);
      encoded.push(`${trigger.triggerName}`);

      if (trigger.endTime !== 0) {
        encoded.push(`${trigger.startTime}`);
        encoded.push(`${trigger.endTime}`);
      }

      const group = trigger.groupNumber !== 0 ? -trigger.groupNumber : '';

      encoded[encoded.length - 1] += group;
    }

    return ' ' + encoded.join(',');
  }

  /**
   * Encodes storyboard command.
   * @param command A storyboard command.
   * @param nested Is it nested command?
   * @returns Encoded storyboard command.
   */
  static encodeCommand(command: Command, nested = false): string {
    const encoded: string[] = [];

    const indentation = nested ? '  ' : ' ';

    encoded.push(command.acronym);
    encoded.push(`${command.easing}`);
    encoded.push(`${command.startTime}`);

    const endTime = command.startTime !== command.endTime ? command.endTime : '';

    encoded.push(`${endTime}`);
    encoded.push(EventsEncoder.encodeCommandArguments(command));

    return indentation + encoded.join(',');
  }

  /**
   * Encodes all arguments of a command.
   * @param command A storyboard command.
   * @returns Encoded command arguments.
   */
  static encodeCommandArguments(command: Command): string {
    switch (command.type) {
      case CommandType.Scale:
      case CommandType.VectorScale: {
        const scale = command as VectorScaleCommand;

        if (scale.startScale.equals(scale.endScale)) {
          return scale.type === CommandType.Scale
            ? `${scale.startScale.x}`
            : `${scale.startScale}`;
        }

        return scale.type === CommandType.Scale
          ? `${scale.startScale.x},${scale.endScale.x}`
          : `${scale.startScale},${scale.endScale}`;
      }

      case CommandType.Movement:
      case CommandType.MovementX:
      case CommandType.MovementY: {
        const move = command as MoveCommand;

        if (move.type === CommandType.Movement) {
          return !move.startPosition.equals(move.endPosition)
            ? `${move.startPosition},${move.endPosition}`
            : `${move.startPosition}`;
        }

        return (move.startX !== move.endX || move.startY !== move.endY)
          ? `${move.startX || move.startY},${move.endX || move.endY}`
          : `${move.startX || move.startY}`;
      }

      case CommandType.Fade: {
        const fade = command as FadeCommand;

        return fade.startOpacity !== fade.endOpacity
          ? `${fade.startOpacity},${fade.endOpacity}`
          : `${fade.startOpacity}`;
      }

      case CommandType.Rotation: {
        const rotation = command as RotateCommand;

        return rotation.startRotate !== rotation.endRotate
          ? `${rotation.startRotate},${rotation.endRotate}`
          : `${rotation.startRotate}`;
      }

      case CommandType.Colour: {
        const colour = command as ColourCommand;

        return !colour.startColour.equals(colour.endColour)
          ? `${colour.startColour},${colour.endColour}`
          : `${colour.startColour}`;
      }

      case CommandType.Parameter: {
        const parameter = command as ParameterCommand;

        switch (parameter.parameter) {
          case ParameterType.HorizontalFlip:
            return 'H';

          case ParameterType.VerticalFlip:
            return 'V';

          case ParameterType.BlendingMode:
            return 'A';
        }
      }
    }

    return '';
  }
}
