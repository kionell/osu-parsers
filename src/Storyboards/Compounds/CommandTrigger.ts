import { Compound } from './Compound';
import { CompoundType } from '../Enums/CompoundType';

export class CommandTrigger extends Compound {
  type: CompoundType = CompoundType.Trigger;

  /**
   * The name of the trigger.
   */
  triggerName: string;

  /**
   * The start time of the command trigger.
   */
  startTime: number;

  /**
   * The end time of the command trigger.
   */
  endTime: number;

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
  constructor(
    triggerName?: string,
    startTime?: number,
    endTime?: number,
    groupNumber?: number
  ) {
    super();

    this.triggerName = triggerName || '';
    this.startTime = startTime || 0;
    this.endTime = endTime || 0;
    this.groupNumber = groupNumber || 0;
  }
}
