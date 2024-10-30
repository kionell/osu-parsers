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
   * This is not synchronized with {@link timelineGroup}
   * as constantly updating it can be very expensive.
   * If you need to update this array, use {@link updateCommands}.
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

  /**
   * Collects all commands from every timeline and loop.
   * All loop commands are unwinded, which means there is no need to iterate over loops.
   * This method also updates {@link commands} array.
   * @returns General command array of this sprite.
   */
  updateCommands(): Command[];

  /**
   * If this storyboard element has commands or not.
   */
  hasCommands: boolean;
}
