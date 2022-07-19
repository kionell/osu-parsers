import { LayerType } from '../../Enums/LayerType';

/**
 * A storyboard element.
 */
export interface IStoryboardElement {
  /**
   * The layer of the storyboard element.
   */
  layer: LayerType;

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
