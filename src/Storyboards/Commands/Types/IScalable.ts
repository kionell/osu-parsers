import { Vector2 } from '../../../Utils';

/**
 * A storyboard command that scales elements.
 */
export interface IScalable {
  /**
   * The starting scale of an element.
   */
  startScale: Vector2;
  /**
   * The ending scale of an element.
   */
  endScale: Vector2;
}
