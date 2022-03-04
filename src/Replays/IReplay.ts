import { IReplayFrame } from './IReplayFrame';

/**
 * A replay.
 */
export interface IReplay {
  /**
   * osu! game version of this replay.
   */
  gameVersion: number;

  /**
   * Game mode of this replay.
   */
  mode: number;

  /**
   * Replay MD5 hash.
   */
  hashMD5: string;

  /**
   * Replay frames.
   */
  frames: IReplayFrame[];
}
