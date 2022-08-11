import { IHasCommands, IStoryboardElementWithDuration } from './Types';
import { CommandTimelineGroup, CommandLoop, CommandTrigger, Command } from '../Commands';
import { Anchor, Origins } from '../Enums';
import { Vector2 } from '../../Utils';

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
   * The relative start position of the storyboard sprite.
   */
  startPosition: Vector2;

  /**
   * The file path of the content of this storyboard sprite.
   */
  filePath: string;

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
   * The list of commands of the storyboard element.
   * Use {@link timelineGroup} property instead.
   * @deprecated Since 0.10.0
   */
  get commands(): Command[] {
    return this.timelineGroup.commands;
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

  /**
   * The start time of the storyboard sprite.
   */
  get startTime(): number {
    // !!! This is wrong and doesn't match stable as it breaks animations.

    // Check for presence affecting commands as an initial pass.
    // let earliestStartTime = this.timelineGroup.earliestDisplayedTime ?? Infinity;

    // for (const loop of this.loops) {
    //   if (loop.earliestDisplayedTime === null) continue;

    //   earliestStartTime = Math.min(
    //     earliestStartTime,
    //     loop.loopStartTime + loop.earliestDisplayedTime,
    //   );
    // }

    // if (earliestStartTime < Infinity) return earliestStartTime;

    // If an alpha-affecting command was not found, use the earliest of any command.
    let earliestStartTime = this.timelineGroup.startTime;

    for (const loop of this.loops) {
      earliestStartTime = Math.min(earliestStartTime, loop.startTime);
    }

    return earliestStartTime;
  }

  /**
   * The end time of the storyboard sprite.
   */
  get endTime(): number {
    let latestEndTime = this.timelineGroup.endTime;

    for (const loop of this.loops) {
      latestEndTime = Math.max(latestEndTime, loop.endTime);
    }

    return latestEndTime;
  }

  get duration(): number {
    return this.endTime - this.startTime;
  }

  get hasCommands(): boolean {
    return this.timelineGroup.hasCommands || !!this.loops.find((l) => l.hasCommands);
  }

  get isDrawable(): boolean {
    return this.hasCommands;
  }

  /**
   * Creates a new instance of the storyboard command loop.
   * @param startTime The start time of the loop.
   * @param repeatCount The number of repeats of this loop.
   */
  public addLoop(startTime: number, repeatCount: number): CommandLoop {
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
  public addTrigger(triggerName: string, startTime: number, endTime: number, groupNumber: number): CommandTrigger {
    const trigger = new CommandTrigger(triggerName, startTime, endTime, groupNumber);

    this.triggers.push(trigger);

    return trigger;
  }
}
