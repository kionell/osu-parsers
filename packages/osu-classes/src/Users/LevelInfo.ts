/**
 * A level information of a user.
 */
export class LevelInfo {
  /**
   * Current level of a user as integer.
   */
  current: number;

  /**
   * Progress to the next level as integer in range of 0-100.
   */
  progress: number;

  constructor(options?: Partial<LevelInfo>) {
    this.current = options?.current ?? 0;
    this.progress = options?.progress ?? 0;
  }

  /**
   * Creates a deep copy of the level info.
   * @returns Cloned level info.
   */
  clone(): LevelInfo {
    return new LevelInfo(this);
  }

  /**
   * @returns Stringified level information.
   */
  toString(): string {
    let progress = this.progress;

    while (progress > 1) progress /= 100;

    return `${this.current + this.progress}`;
  }
}
