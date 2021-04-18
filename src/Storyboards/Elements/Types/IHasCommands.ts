import { Command } from '../../Commands/Command';
import { CommandLoop } from '../../Compounds/CommandLoop';
import { CommandTrigger } from '../../Compounds/CommandTrigger';
import { IStoryboardElement } from './IStoryboardElement';

/**
 * A storyboard element that has commands.
 */
export interface IHasCommands extends IStoryboardElement {
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
