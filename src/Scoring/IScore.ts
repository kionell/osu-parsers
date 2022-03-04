import { IScoreInfo } from './IScoreInfo';
import { IReplay } from '../Replays';

/**
 * A score.
 */
export interface IScore {
  /**
   * Score information.
   */
  info: IScoreInfo;

  /**
   * Score replay.
   */
  replay: IReplay | null;
}
