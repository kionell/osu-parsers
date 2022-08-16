import {
  Storyboard,
  StoryboardVideo,
  StoryboardSprite,
  StoryboardAnimation,
  StoryboardSample,
  CommandTimelineGroup,
  CompoundType,
  CommandType,
  ParameterType,
  EventType,
  LayerType,
  LoopType,
  Origins,
  Anchor,
  Vector2,
  Color4,
  BlendingParameters,
} from 'osu-classes';

import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for storyboard elements, compounds and commands.
 */
export abstract class StoryboardEventDecoder {
  /**
   * Current storyboard sprite.
   */
  declare private static _storyboardSprite: StoryboardSprite;

  /**
   * Current storyboard timeline group.
   */
  declare private static _timelineGroup: CommandTimelineGroup;

  /**
   * Decodes a storyboard line to get storyboard event data.
   * @param line Storyboard line.
   * @param storyboard A parsed storyboard object.
   */
  static handleLine(line: string, storyboard: Storyboard): void {
    const depth = this._getDepth(line);

    if (depth > 0) line = line.substring(depth);

    // Exit from a loop or a trigger and add commands to the element.
    if (depth < 2 && this._storyboardSprite) {
      this._timelineGroup = this._storyboardSprite.timelineGroup;
    }

    switch (depth) {
      // Storyboard element
      case 0: return this._handleElement(line, storyboard);

      // Storyboard element compound or command
      case 1: return this._handleCompoundOrCommand(line);

      // Storyboard element compounded command
      case 2: return this._handleCommand(line);
    }
  }

  /**
   * Decodes a storyboard line and adds a new element to the storyboard.
   * @param line Storyboard line.
   * @param storyboard Storyboard object.
   */
  private static _handleElement(line: string, storyboard: Storyboard): void {
    const data = line.split(',');

    const eventType = this.parseEventType(data[0]);

    // Update sprite values before parsing next element.
    if (eventType === EventType.Sprite || eventType === EventType.Animation) {
      if (this._storyboardSprite?.hasCommands) {
        this._storyboardSprite.updateCommands();
        this._storyboardSprite.adjustTimesToCommands();
        this._storyboardSprite.resetValuesToCommands();
      }
    }

    switch (eventType) {
      case EventType.Video: {
        const layer = storyboard.getLayerByType(LayerType.Video);
        const offset = Parsing.parseInt(data[1]);
        const path = data[2].replace(/"/g, '');

        layer.elements.push(new StoryboardVideo(path, offset));

        return;
      }

      case EventType.Sprite: {
        const layer = storyboard.getLayerByType(this.parseLayerType(data[1]));
        const origin = this.parseOrigin(data[2]);
        const anchor = this.convertOrigin(origin);
        const path = data[3].replace(/"/g, '');
        const x = Parsing.parseFloat(data[4], Parsing.MAX_COORDINATE_VALUE);
        const y = Parsing.parseFloat(data[5], Parsing.MAX_COORDINATE_VALUE);

        this._storyboardSprite = new StoryboardSprite(
          path,
          origin,
          anchor,
          new Vector2(x, y),
        );

        layer.elements.push(this._storyboardSprite);

        return;
      }

      case EventType.Animation: {
        const layer = storyboard.getLayerByType(this.parseLayerType(data[1]));
        const origin = this.parseOrigin(data[2]);
        const anchor = this.convertOrigin(origin);
        const path = data[3].replace(/"/g, '');
        const x = Parsing.parseFloat(data[4], Parsing.MAX_COORDINATE_VALUE);
        const y = Parsing.parseFloat(data[5], Parsing.MAX_COORDINATE_VALUE);
        const frameCount = Parsing.parseInt(data[6]);

        let frameDelay = Parsing.parseFloat(data[7]);

        if (storyboard.fileFormat < 6) {
          /**
           * This is random as hell but taken straight from osu!stable.
           */
          frameDelay = Math.round(0.015 * frameDelay) * 1.186 * (1000 / 60);
        }

        const loopType = this.parseLoopType(data[8]);

        this._storyboardSprite = new StoryboardAnimation(
          path,
          origin,
          anchor,
          new Vector2(x, y),
          frameCount,
          frameDelay,
          loopType,
        );

        layer.elements.push(this._storyboardSprite);

        return;
      }

      case EventType.Sample: {
        const time = Parsing.parseFloat(data[1]);
        const layer = storyboard.getLayerByType(this.parseLayerType(data[2]));
        const path = data[3].replace(/"/g, '');
        const volume = data.length > 4 ? Parsing.parseInt(data[4]) : 100;

        const sample = new StoryboardSample(path, time, volume);

        layer.elements.push(sample);

      }
    }
  }

  /**
   * Decodes a storyboard line and adds a new compound or command to the storyboard.
   * @param line Storyboard line.
   */
  private static _handleCompoundOrCommand(line: string): void {
    const data = line.split(',');

    const compoundType = data[0] as CompoundType;

    switch (compoundType) {
      case CompoundType.Trigger: {
        this._timelineGroup = this._storyboardSprite?.addTrigger(
          data[1], // Trigger name.
          data.length > 2 ? Parsing.parseFloat(data[2]) : -Infinity, // Trigger start time.
          data.length > 3 ? Parsing.parseFloat(data[3]) : Infinity, // Trigger end time.
          data.length > 4 ? Parsing.parseInt(data[4]) : 0, // Trigger group number.
        );

        return;
      }

      case CompoundType.Loop: {
        this._timelineGroup = this._storyboardSprite?.addLoop(
          Parsing.parseFloat(data[1]), // Loop start time.
          Math.max(0, Parsing.parseInt(data[2]) - 1), // Loop repeat count.
        );

        return;
      }

      default: this._handleCommand(line);
    }
  }

  /**
   * Decodes a storyboard line and adds a new command to the storyboard.
   * @param line Storyboard line.
   */
  private static _handleCommand(line: string): void {
    const data = line.split(',');

    const type = data[0] as CommandType;
    const easing = Parsing.parseInt(data[1]);
    const startTime = Parsing.parseInt(data[2]);

    /**
     * Some commands may not have end time.
     * We will use start time as a fallback.
     */
    const endTime = Parsing.parseInt(data[3] || data[2]);

    switch (type) {
      case CommandType.Fade: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.alpha.add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }

      case CommandType.Scale: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.scale.add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }

      case CommandType.VectorScale: {
        const startX = Parsing.parseFloat(data[4]);
        const startY = Parsing.parseFloat(data[5]);
        const endX = data.length > 6 ? Parsing.parseFloat(data[6]) : startX;
        const endY = data.length > 7 ? Parsing.parseFloat(data[7]) : startY;

        this._timelineGroup?.vectorScale.add(
          type,
          easing,
          startTime,
          endTime,
          new Vector2(startX, startY),
          new Vector2(endX, endY),
        );

        return;
      }

      case CommandType.Rotation: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.rotation.add(
          type,
          easing,
          startTime,
          endTime,
          startValue,
          endValue,
        );

        return;
      }

      case CommandType.Movement: {
        const startX = Parsing.parseFloat(data[4]);
        const startY = Parsing.parseFloat(data[5]);
        const endX = data.length > 6 ? Parsing.parseFloat(data[6]) : startX;
        const endY = data.length > 7 ? Parsing.parseFloat(data[7]) : startY;

        /**
         * Force MovementX and MovementY types for compatibility with old command format.
         */
        this._timelineGroup?.x
          .add(CommandType.MovementX, easing, startTime, endTime, startX, endX);

        this._timelineGroup?.y
          .add(CommandType.MovementY, easing, startTime, endTime, startY, endY);

        return;
      }

      case CommandType.MovementX: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.x
          .add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }

      case CommandType.MovementY: {
        const startValue = Parsing.parseFloat(data[4]);
        const endValue = data.length > 5 ? Parsing.parseFloat(data[5]) : startValue;

        this._timelineGroup?.y
          .add(type, easing, startTime, endTime, startValue, endValue);

        return;
      }

      case CommandType.Color: {
        const startRed = Parsing.parseFloat(data[4]);
        const startGreen = Parsing.parseFloat(data[5]);
        const startBlue = Parsing.parseFloat(data[6]);
        const endRed = data.length > 7 ? Parsing.parseFloat(data[7]) : startRed;
        const endGreen = data.length > 8 ? Parsing.parseFloat(data[8]) : startGreen;
        const endBlue = data.length > 9 ? Parsing.parseFloat(data[9]) : startBlue;

        this._timelineGroup?.color.add(
          type,
          easing,
          startTime,
          endTime,
          new Color4(startRed, startGreen, startBlue, 1),
          new Color4(endRed, endGreen, endBlue, 1),
        );

        return;
      }

      case CommandType.Parameter: {
        return this._handleParameterCommand(data);
      }
    }

    throw new Error(`Unknown command type: ${type}`);
  }

  private static _handleParameterCommand(data: string[]): void {
    const type = CommandType.Parameter;
    const easing = Parsing.parseInt(data[1]);
    const startTime = Parsing.parseInt(data[2]);

    /**
     * Some commands may not have end time.
     * We will use start time as a fallback.
     */
    const endTime = Parsing.parseInt(data[3] || data[2]);
    const parameter = data[4] as ParameterType;

    switch (parameter) {
      case ParameterType.BlendingMode: {
        const startValue = BlendingParameters.Additive;
        const endValue = startTime === endTime
          ? BlendingParameters.Additive
          : BlendingParameters.Inherit;

        this._timelineGroup?.blendingParameters
          .add(type, easing, startTime, endTime, startValue, endValue, parameter);

        return;
      }

      case ParameterType.HorizontalFlip:
        this._timelineGroup?.flipH
          .add(type, easing, startTime, endTime, true, startTime === endTime, parameter);

        return;

      case ParameterType.VerticalFlip: {
        this._timelineGroup?.flipV
          .add(type, easing, startTime, endTime, true, startTime === endTime, parameter);

        return;
      }
    }

    throw new Error(`Unknown parameter type: ${parameter}`);
  }

  static parseEventType(input: string): EventType {
    if (input.startsWith(' ') || input.startsWith('_')) {
      return EventType.StoryboardCommand;
    }

    try {
      return Parsing.parseEnum(EventType, input);
    }
    catch {
      throw new Error(`Unknown event type: ${input}`);
    }
  }

  static parseLayerType(input: string): LayerType {
    try {
      return Parsing.parseEnum(LayerType, input);
    }
    catch {
      throw new Error(`Unknown layer type: ${input}`);
    }
  }

  static parseOrigin(input: string): Origins {
    try {
      return Parsing.parseEnum(Origins, input);
    }
    catch {
      return Origins.TopLeft;
    }
  }

  static convertOrigin(origin: Origins): Anchor {
    switch (origin) {
      case Origins.TopLeft: return Anchor.TopLeft;
      case Origins.TopCentre: return Anchor.TopCentre;
      case Origins.TopRight: return Anchor.TopRight;
      case Origins.CentreLeft: return Anchor.CentreLeft;
      case Origins.Centre: return Anchor.Centre;
      case Origins.CentreRight: return Anchor.CentreRight;
      case Origins.BottomLeft: return Anchor.BottomLeft;
      case Origins.BottomCentre: return Anchor.BottomCentre;
      case Origins.BottomRight: return Anchor.BottomRight;
    }

    return Anchor.TopLeft;
  }

  static parseLoopType(input: string): LoopType {
    try {
      return Parsing.parseEnum(LoopType, input);
    }
    catch {
      return LoopType.LoopForever;
    }
  }

  private static _getDepth(line: string): number {
    let depth = 0;

    for (const char of line) {
      if (char !== ' ' && char !== '_') break;

      ++depth;
    }

    return depth;
  }
}
