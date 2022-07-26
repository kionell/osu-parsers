/**
 * A storyboard command timeline.
 */
export interface ICommandTimeline {
  /**
   * The time at which the command timeline starts.
   */
  startTime: number;

  /**
   * The time at which the command timeline ends.
   */
  endTime: number;

  /**
   * Whether this command timeline has commands or not?
   */
  hasCommands: boolean;
}
