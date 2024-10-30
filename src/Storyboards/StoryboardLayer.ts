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

  /**
   * Should this layer be masked or not?
   */
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

  constructor(params: Required<Pick<StoryboardLayer, 'name' | 'depth'>> & Partial<StoryboardLayer>) {
    this.name = params.name;
    this.depth = params.depth;
    this.masking = params.masking ?? true;
  }
}
