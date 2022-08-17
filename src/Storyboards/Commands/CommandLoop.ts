import { CompoundType } from '../Enums';
import { Command } from './Command';
import { CommandTimelineGroup } from './CommandTimelineGroup';

/**
 * A storyboard command loop.
 */
export class CommandLoop extends CommandTimelineGroup {
  /**
   * Compound type.
   */
  type: CompoundType = CompoundType.Loop;

  /**
   * The start time of the loop.
   */
  loopStartTime: number;

  /**
   * The total number of repeats.
   */
  loopCount: number;

  /**
   * Creates a new instance of the storyboard command loop.
   * @param loopStartTime The start time of the loop.
   * @param loopCount The number of repeats of this loop.
   */
  constructor(loopStartTime?: number, loopCount?: number) {
    super();

    this.loopStartTime = loopStartTime || 0;
    this.loopCount = loopCount || 0;
  }

  /**
   * The total number of times this loop is played back. Always greater than zero.
   */
  get totalIterations(): number {
    return this.loopCount + 1;
  }

  /**
   * The start time of the command loop.
   */
  get startTime(): number {
    return this.loopStartTime + this.commandsStartTime;
  }

  /**
   * The end time of the command loop.
   */
  get endTime(): number {
    return this.startTime + this.commandsDuration * this.totalIterations;
  }

  unrollCommands(): Command[] {
    const commands = this.commands;

    if (commands.length === 0) return [];

    const { commandsDuration, loopCount, loopStartTime } = this;

    const unrolledCommands = new Array(loopCount * commands.length);

    for (let i = 0; i < loopCount; i++) {
      const iterationStartTime = loopStartTime + i * commandsDuration;

      for (let j = 0; j < commands.length; j++) {
        const currentIndex = i * commands.length + j;
        const command = commands[j];

        unrolledCommands[currentIndex] = new Command({
          ...command,
          startTime: command.startTime + iterationStartTime,
          endTime: command.endTime + iterationStartTime,
        });
      }
    }

    return unrolledCommands;
  }
}
