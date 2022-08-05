import {
  CommandTimelineGroup,
  CommandLoop,
  CommandTrigger,
  Command,
} from '../../Commands';

import { IStoryboardElement } from './IStoryboardElement';

/**
 * A storyboard element that has commands.
 */
export interface IHasCommands extends IStoryboardElement {
  /**
   * The list of commands of the storyboard element.
   * Use {@link timelineGroup} property instead.
   * @deprecated Since 0.10.4
   */
  commands: Command[];

  /**
   * The command timeline group of this storyboard element.
   */
  timelineGroup: CommandTimelineGroup;

  /**
   * The list of command loops of the storyboard element.
   */
  loops: CommandLoop[];

  /**
   * The list of command triggers of the storyboard element.
   */
  triggers: CommandTrigger[];
}
