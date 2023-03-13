/**
 * A level information of a user.
 */
export class LevelInfo {
  /**
   * Current level of a user.
   */
  current: number;

  /**
   * Progress to the next level.
   */
  progress: number;

  constructor(current?: number, progress?: number) {
    this.current = current ?? 0;
    this.progress = progress ?? 0;
  }

  /**
   * Creates a deep copy of the level info.
   * @returns Cloned level info.
   */
  clone(): LevelInfo {
    return new LevelInfo(this.current, this.progress);
  }
}
