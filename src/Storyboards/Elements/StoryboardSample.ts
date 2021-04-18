import { IStoryboardElement } from './Types/IStoryboardElement';
import { LayerType } from '../Enums/LayerType';

/**
 * A storyboard sample.
 */
export class StoryboardSample implements IStoryboardElement {
  /**
   * The layer of the storyboard sample.
   */
  layer: LayerType = LayerType.Samples;

  /**
   * The start time of the storyboard sample.
   */
  startTime = 0;

  /**
   * The volume of the storyboard sample.
   */
  volume = 100;

  /**
   * The file path of the sound of this sample.
   */
  filePath = '';
}
