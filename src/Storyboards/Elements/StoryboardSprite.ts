import { IHasCommands, IStoryboardElementWithDuration } from './Types';
import { CommandTimelineGroup, CommandLoop, CommandTrigger, Command } from '../Commands';
import { Anchor, CommandType, Origins, ParameterType } from '../Enums';
import { Color4, Vector2 } from '../../Types';

/**
 * A storyboard sprite.
 */
export class StoryboardSprite implements IStoryboardElementWithDuration, IHasCommands {
  /**
   * The origin of the image on the screen.
   */
  origin: Origins;

  /**
   * The anchor of the image on the screen.
   */
  anchor: Anchor;

  /**
   * The start time of the storyboard sprite.
   */
  startTime = Infinity;

  /**
   * The end time of the storyboard sprite.
   */
  endTime = -Infinity;

  /**
   * The file path of the content of this storyboard sprite.
   */
  filePath: string;

  /**
   * The list of commands of the storyboard element.
   * This is not synchronized with {@link timelineGroup}
   * as constantly updating it can be very expensive.
   * If you need to update this array, use {@link updateCommands}.
   */
  commands: Command[] = [];

  /**
   * The list of commands of the storyboard sprite.
   */
  timelineGroup: CommandTimelineGroup = new CommandTimelineGroup();

  /**
   * The list of command loops of the storyboard sprite.
   */
  loops: CommandLoop[] = [];

  /**
   * The list of command triggers of the storyboard sprite.
   */
  triggers: CommandTrigger[] = [];

  /**
   * The relative start position of the storyboard sprite.
   */
  startPosition: Vector2;

  /**
   * Current scale of this sprite.
   */
  scale = new Vector2(1, 1);

  /**
   * Current color of this sprite.
   */
  color = new Color4();

  /**
   * Current rotation of this sprite.
   */
  rotation = 0;

  /**
   * If this sprite is fliped horizontally.
   */
  flipX = false;

  /**
   * If this sprite is fliped vertically.
   */
  flipY = false;

  /**
   * If this sprite is using additive blending.
   */
  isAdditive = false;

  /**
   * @param path The file path of the content of this storyboard sprite.
   * @param origin The origin of the image on the screen.
   * @param anchor The anchor of the image on the screen.
   * @param position The relative start position of the storyboard sprite.
   * @constructor
   */
  constructor(path: string, origin: Origins, anchor: Anchor, position: Vector2) {
    this.filePath = path ?? '';
    this.origin = origin ?? Origins.TopLeft;
    this.anchor = anchor ?? Anchor.TopLeft;
    this.startPosition = position ?? new Vector2(0, 0);
  }

  /**
   * The start X-position of the storyboard sprite.
   */
  get startX(): number {
    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
  }

  /**
   * The start Y-position of the storyboard sprite.
   */
  get startY(): number {
    return this.startPosition.y;
  }

  set startY(value: number) {
    this.startPosition.y = value;
  }

  get duration(): number {
    return this.endTime - this.startTime;
  }

  get hasCommands(): boolean {
    return this.timelineGroup.hasCommands
      || this.loops.some((l) => l.hasCommands)
      || this.triggers.some((t) => t.hasCommands);
  }

  get isDrawable(): boolean {
    return this.hasCommands;
  }

  /**
   * Creates a new instance of the storyboard command loop.
   * @param startTime The start time of the loop.
   * @param repeatCount The number of repeats of this loop.
   */
  addLoop(startTime: number, repeatCount: number): CommandLoop {
    const loop = new CommandLoop(startTime, repeatCount);

    this.loops.push(loop);

    return loop;
  }

  /**
   * Creates a new instance of command trigger.
   * @param triggerName The name of the trigger.
   * @param startTime The start time of the command trigger.
   * @param endTime The end time of the command trigger.
   * @param groupNumber The group of the command trigger.
   */
  addTrigger(
    triggerName: string,
    startTime: number,
    endTime: number,
    groupNumber: number,
  ): CommandTrigger {
    const trigger = new CommandTrigger(triggerName, startTime, endTime, groupNumber);

    this.triggers.push(trigger);

    return trigger;
  }

  /**
   * Collects all commands from every timeline and loop.
   * All loop commands are unwinded, which means there is no need to iterate over loops.
   * This method also updates {@link commands} array.
   * @returns General command array of this sprite.
   */
  updateCommands(): Command[] {
    const unwinded = [
      ...this.timelineGroup.commands,
      ...this.loops.flatMap((l) => l.unrollCommands()),
    ];

    this.commands = unwinded.sort((a, b) => a.startTime - b.startTime);

    return this.commands;
  }

  /**
   * Adjusts start & end time of this sprite to the
   * earliest command start time & latest command end time.
   */
  adjustTimesToCommands(): void {
    let earliestStartTime = this.timelineGroup.startTime;
    let latestEndTime = this.timelineGroup.endTime;

    for (const loop of this.loops) {
      earliestStartTime = Math.min(earliestStartTime, loop.startTime);
      latestEndTime = Math.max(latestEndTime, loop.endTime);
    }
  }

  /**
   * Resets all sprite values to first applied command values.
   */
  resetValuesToCommands(): void {
    const applied: Partial<Record<CommandType, boolean>> = {};

    for (const command of this.commands) {
      if (!applied[command.type]) {
        this.setValueFromCommand(command);

        applied[command.type] = true;
      }
    }
  }

  /**
   * Replaces current sprite values with command values.
   * @param command Target command.
   */
  setValueFromCommand(command: Command): void {
    const value = command.getValueAtProgress(0);

    switch (command.type) {
      case CommandType.Movement:
        this.startPosition.x = value.x;
        this.startPosition.y = value.y;
        break;

      case CommandType.MovementX:
        this.startPosition.x = value;
        break;

      case CommandType.MovementY:
        this.startPosition.y = value;
        break;

      case CommandType.Fade:
        this.color.alpha = value;
        break;

      case CommandType.Scale:
        this.scale.x = value;
        this.scale.y = value;
        break;

      case CommandType.VectorScale:
        this.scale.x = value.x;
        this.scale.y = value.y;
        break;

      case CommandType.Rotation:
        this.rotation = value;
        break;

      case CommandType.Color:
        this.color.red = value.red;
        this.color.green = value.green;
        this.color.blue = value.blue;
        this.color.alpha = value.alpha;
        break;
    }

    if (command.type !== CommandType.Parameter) return;

    switch (command.parameter) {
      case ParameterType.BlendingMode:
        this.isAdditive = !!value;
        break;

      case ParameterType.HorizontalFlip:
        this.flipX = value;
        break;

      case ParameterType.VerticalFlip:
        this.flipY = value;
    }
  }
}
