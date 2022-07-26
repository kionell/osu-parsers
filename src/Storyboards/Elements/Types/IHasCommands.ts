import {
  CommandTimelineGroup,
  CommandLoop,
  CommandTrigger,
} from '../../Commands';

/**
 * A storyboard element that has commands.
 */
export interface IHasCommands {
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
