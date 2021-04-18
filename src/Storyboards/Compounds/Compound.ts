import { Command } from '../Commands/Command';
import { CompoundType } from '../Enums/CompoundType';

/**
 * A storyboard compounded command.
 */
export abstract class Compound {
  /**
   * The type of the compounded command.
   */
  type: CompoundType = CompoundType.None;

  /**
   * The list of the storyboard commands.
   */
  commands: Command[] = [];

  /**
   * The start time of the first command 
   * relative to the start time of the compound.
   */
  get commandsStartTime(): number {
    const timeLine = this.commands.map((c) => c.startTime);

    timeLine.sort((a, b) => a - b);

    return timeLine[0];
  }

  /**
   * The end time of the last command 
   * relative to the start time of the compound.
   */
  get commandsEndTime(): number {
    const timeLine = this.commands.map((c) => c.endTime);

    timeLine.sort((a, b) => b - a);

    return timeLine[0];
  }

  /**
   * The duration of the commands in this compound.
   */
  get commandsDuration(): number {
    return this.commandsEndTime - this.commandsStartTime;
  }

  abstract get startTime(): number;

  abstract get endTime(): number;
}
