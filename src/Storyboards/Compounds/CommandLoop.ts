import { Compound } from './Compound';
import { CompoundType } from '../Enums/CompoundType';

/**
 * A storyboard command loop.
 */
export class CommandLoop extends Compound {
  type: CompoundType = CompoundType.Loop;

  /**
   * The start time of the loop.
   */
  loopStartTime: number;

  /**
   * The number of loops.
   */
  loopCount: number;

  /**
   * Creates a new instance of the storyboard command loop.
   * @param loopStartTime The start time of the loop.
   * @param loopCount The number of loops.
   */
  constructor(loopStartTime?: number, loopCount?: number) {
    super();

    this.loopStartTime = loopStartTime || 0;
    this.loopCount = loopCount || 0;
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
    return this.startTime + this.commandsDuration * this.loopCount;
  }
}
