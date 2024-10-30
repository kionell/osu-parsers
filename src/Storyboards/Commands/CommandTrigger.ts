import { CommandTimelineGroup } from './CommandTimelineGroup';
import { CompoundType } from '../Enums/CompoundType';
import { Command } from './Command';

export class CommandTrigger extends CommandTimelineGroup {
  /**
   * Compound type.
   */
  type: CompoundType = CompoundType.Trigger;

  /**
   * The name of the trigger.
   */
  triggerName: string;

  /**
   * The start time of the command trigger.
   */
  triggerStartTime: number;

  /**
   * The end time of the command trigger.
   */
  triggerEndTime: number;

  /**
   * The group of the command trigger.
   */
  groupNumber: number;

  /**
   * Creates a new instance of command trigger.
   * @param triggerName The name of the trigger.
   * @param startTime The start time of the command trigger.
   * @param endTime The end time of the command trigger.
   * @param groupNumber The group of the command trigger.
   */
  constructor(triggerName?: string, startTime?: number, endTime?: number, groupNumber?: number) {
    super();

    this.triggerName = triggerName || '';
    this.triggerStartTime = startTime || 0;
    this.triggerEndTime = endTime || 0;
    this.groupNumber = groupNumber || 0;
  }

  unrollCommands(): Command[] {
    const commands = this.commands;

    if (commands.length === 0) return [];

    const unrolledCommands = new Array(commands.length);

    for (let i = 0; i < commands.length; i++) {
      unrolledCommands[i] = new Command({
        ...commands[i],
        startTime: commands[i].startTime + this.triggerStartTime,
        endTime: commands[i].endTime + this.triggerStartTime,
      });
    }

    return unrolledCommands;
  }
}
