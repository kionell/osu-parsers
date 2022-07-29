import { Vector2 } from '../../../Utils';

/**
 * A storyboard command that scales elements.
 * @deprecated Since 0.10.0
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
