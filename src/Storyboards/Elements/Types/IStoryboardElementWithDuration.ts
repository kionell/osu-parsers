import { IStoryboardElement } from './IStoryboardElement';

/**
 * A storyboard element that ends at a different time than its start time.
 */
export interface IStoryboardElementWithDuration extends IStoryboardElement {
  /**
   * The time at which this storyboard element ends.
   */
  endTime: number;

  /**
   * The duration of the storyboard element.
   */
  duration: number;
}
