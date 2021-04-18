import { StoryboardSprite } from './StoryboardSprite';
import { LoopType } from '../Enums/LoopType';

/**
 * A storyboard animation.
 */
export class StoryboardAnimation extends StoryboardSprite {
  /**
   * The number of frames in this animation.
   */
  frames = 0;

  /**
   * The delay (in milliseconds) between each frame of the animation.
   */
  frameDelay = 0;

  /**
   * Indicates if the animation should loop or not.
   */
  loop: LoopType = LoopType.LoopForever;
}
