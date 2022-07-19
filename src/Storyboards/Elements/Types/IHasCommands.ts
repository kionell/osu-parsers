import { Command } from '../../Commands';
import { CommandLoop, CommandTrigger } from '../../Compounds';

/**
 * A storyboard element that has commands.
 */
export interface IHasCommands {
  /**
   * The list of commands of the storyboard element.
   */
  commands: Command[];

  /**
   * The list of command loops of the storyboard element.
   */
  loops: CommandLoop[];

  /**
   * The list of command triggers of the storyboard element.
   */
  triggers: CommandTrigger[];
}
