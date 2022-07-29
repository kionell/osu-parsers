import { IStoryboardElement } from './Types/IStoryboardElement';

/**
 * A storyboard video.
 */
export class StoryboardVideo implements IStoryboardElement {
  /**
   * The start time of the storyboard video.
   */
  startTime: number;

  /**
   * The file path of this video.
   */
  filePath: string;

  get isDrawable(): boolean {
    return true;
  }

  constructor(path: string, time: number) {
    this.filePath = path ?? '';
    this.startTime = time ?? 0;
  }
}
