import { Vector2 } from '../../Utils';

import { PathType } from '../Enums/PathType';

/**
 * A path point.
 */
export class PathPoint {
  /**
   * The position at which path point starts.
   */
  position: Vector2;

  /**
   * A type of path point.
   */
  type: PathType | null;

  /**
   * Creates a new instance of path point.
   * @param position The position at which path point starts.
   * @param type A type of path point.
   * @constructor
   */
  constructor(position: Vector2, type: PathType | null) {
    this.position = position;
    this.type = type;
  }
}
