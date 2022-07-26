import { IStoryboardElement } from './Types/IStoryboardElement';
import { LayerType } from '../Enums/LayerType';

/**
 * A storyboard video.
 */
export class StoryboardVideo implements IStoryboardElement {
  /**
   * The layer of the storyboard video.
   */
  layer: LayerType = LayerType.Video;

  /**
   * The start time of the storyboard video.
   */
  startTime = 0;

  /**
   * The file path of this video.
   */
  filePath = '';

  get isDrawable(): boolean {
    return true;
  }

  constructor(path: string, time: number) {
    this.filePath = path;
    this.startTime = time;
  }
}
