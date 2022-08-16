import { StoryboardSprite } from './StoryboardSprite';
import { LoopType } from '../Enums/LoopType';
import { Anchor, Origins } from '../Enums';
import { Vector2 } from '../../Utils';

/**
 * A storyboard animation.
 */
export class StoryboardAnimation extends StoryboardSprite {
  /**
   * The number of frames in this animation.
   */
  frameCount: number;

  /**
   * The delay (in milliseconds) between each frame of the animation.
   */
  frameDelay: number;

  /**
   * Indicates if the animation should loop or not.
   */
  loopType: LoopType;

  /**
   * @param path The file path of the content of this storyboard sprite.
   * @param origin The origin of the image on the screen.
   * @param anchor The anchor of the image on the screen.
   * @param position The relative start position of the storyboard sprite.
   * @param frameCount The number of frames in this animation.
   * @param frameDelay The delay (in milliseconds) between each frame of the animation.
   * @param loopType Indicates if the animation should loop or not.
   * @constructor
   */
  constructor(
    path: string,
    origin: Origins,
    anchor: Anchor,
    position: Vector2,
    frameCount: number,
    frameDelay: number,
    loopType: LoopType,
  ) {
    super(path, origin, anchor, position);

    this.frameCount = frameCount ?? 0;
    this.frameDelay = frameDelay ?? 0;
    this.loopType = loopType ?? LoopType.LoopForever;
  }
}
