import { IStoryboardElement } from './Elements';

/**
 * A storyboard layer.
 */
export class StoryboardLayer {
  /**
   * Storyboard layer name.
   */
  readonly name: string;

  /**
   * Storyboard layer name.
   */
  readonly depth: number;

  readonly masking: boolean;

  /**
   * Is this layer visible when player is alive.
   */
  visibleWhenPassing = true;

  /**
   * Is this layer visible when player fails.
   */
  visibleWhenFailing = true;

  /**
   * Storyboard layer elements.
   */
  elements: IStoryboardElement[] = [];

  constructor(name: string, depth: number, masking = true) {
    this.name = name;
    this.depth = depth;
    this.masking = masking;
  }
}
