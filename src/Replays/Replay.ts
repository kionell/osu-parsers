import { IReplay } from './IReplay';
import { ReplayFrame } from './ReplayFrame';

/**
 * A replay.
 */
export class Replay implements IReplay {
  /**
   * osu! game version of this replay.
   */
  gameVersion = 0;

  /**
   * Game mode of this replay.
   */
  mode = 0;

  /**
   * Replay MD5 hash.
   */
  hashMD5 = '';

  /**
   * Replay frames.
   */
  frames: ReplayFrame[] = [];

  /**
   * Replay length in milliseconds.
   */
  get length(): number {
    if (!this.frames?.length) return 0;

    const startTime = this.frames[0].startTime;
    const endTime = this.frames[this.frames.length - 1].startTime;

    return endTime - startTime;
  }

  /**
   * Creates a deep copy of the replay.
   * @returns Cloned replay.
   */
  clone(): this {
    const Replay = this.constructor as new () => this;

    const cloned = new Replay();

    cloned.gameVersion = this.gameVersion;
    cloned.mode = this.mode;
    cloned.hashMD5 = this.hashMD5;
    cloned.frames = this.frames.map((f) => f.clone());

    return cloned;
  }

  equals(other: IReplay): boolean {
    return this.hashMD5 === other.hashMD5;
  }
}
