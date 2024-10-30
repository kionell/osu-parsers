/**
 * A storyboard element.
 */
export interface IStoryboardElement {
  /**
   * The start time of the storyboard element.
   */
  startTime: number;

  /**
   * The file path of the content of the storyboard element.
   */
  filePath: string;

  /**
   * Whether this storyboard element can be drawn or not.
   */
  isDrawable: boolean;
}
