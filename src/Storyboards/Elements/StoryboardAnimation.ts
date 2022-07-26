import { StoryboardSprite } from './StoryboardSprite';
import { LoopType } from '../Enums/LoopType';
import { Anchor } from '../Enums';
import { Vector2 } from '../../Utils';

/**
 * A storyboard animation.
 */
export class StoryboardAnimation extends StoryboardSprite {
  /**
   * The number of frames in this animation.
   */
  frameCount = 0;

  /**
   * The delay (in milliseconds) between each frame of the animation.
   */
  frameDelay = 0;

  /**
   * Indicates if the animation should loop or not.
   */
  loopType: LoopType = LoopType.LoopForever;

  /**
   * @param path The file path of the content of this storyboard sprite.
   * @param origin The origin of the image on the screen.
   * @param position The relative start position of the storyboard sprite.
   * @param frameCount The number of frames in this animation.
   * @param frameDelay The delay (in milliseconds) between each frame of the animation.
   * @param loopType Indicates if the animation should loop or not.
   * @constructor
   */
  constructor(path: string, origin: Anchor, position: Vector2, frameCount: number, frameDelay: number, loopType: LoopType) {
    super(path, origin, position);

    this.frameCount = frameCount;
    this.frameDelay = frameDelay;
    this.loopType = loopType;
  }
}
