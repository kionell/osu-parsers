import { CompoundType } from '../Enums';
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
}
