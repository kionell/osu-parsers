import { Replay } from '../Replays';
import { IScore } from './IScore';
import { ScoreInfo } from './ScoreInfo';

/**
 * A score.
 */
export class Score {
  /**
   * Score information.
   */
  info: ScoreInfo = new ScoreInfo();

  /**
   * Score replay.
   */
  replay: Replay | null = null;

  constructor(info?: ScoreInfo, replay?: Replay | null) {
    if (info) this.info = info;
    if (replay) this.replay = replay;
  }

  clone(): this {
    const Score = this.constructor as new () => this;

    const cloned = new Score();

    cloned.info = this.info.clone();
    cloned.replay = this.replay?.clone() ?? null;

    return cloned;
  }

  equals(other: IScore): boolean {
    if (!other) return false;

    const equalScores = this.info.equals(other.info);

    if (this.replay === null && other.replay === null) {
      return equalScores;
    }

    if (this.replay !== null && other.replay !== null) {
      return equalScores && this.replay.equals(other.replay);
    }

    return false;
  }
}
