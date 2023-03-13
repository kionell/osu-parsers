/**
 * A level information of a user.
 */
export class LevelInfo {
  /**
   * Current level of a user.
   */
  current = 0;

  /**
   * Progress to the next level.
   */
  progress = 0;

  constructor(current = 0, progress = 0) {
    this.current = current;
    this.progress = progress;
  }

  /**
   * Creates a deep copy of the level info.
   * @returns Cloned level info.
   */
  clone(): LevelInfo {
    return new LevelInfo(this.current, this.progress);
  }
}
