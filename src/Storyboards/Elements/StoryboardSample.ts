import { IStoryboardElement } from './Types/IStoryboardElement';

/**
 * A storyboard sample.
 */
export class StoryboardSample implements IStoryboardElement {
  /**
   * The start time of the storyboard sample.
   */
  startTime: number;

  /**
   * The volume of the storyboard sample.
   */
  volume: number;

  /**
   * The file path of the sound of this sample.
   */
  filePath: string;

  get isDrawable(): boolean {
    return true;
  }

  constructor(path: string, time: number, volume: number) {
    this.filePath = path ?? '';
    this.startTime = time ?? 0;
    this.volume = volume ?? 100;
  }
}
