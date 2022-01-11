import { IBeatmap } from '../Beatmaps';
import { IRuleset } from '../Rulesets';
import { ModCombination } from '../Mods';
import { ScoreRank } from './Enums/ScoreRank';
import { IHitStatistics } from './IHitStatistics';

/**
 * A score info.
 */
export interface IScoreInfo {
  /**
   * A score ID.
   */
  id: number;

  /**
   * A rank of the play.
   */
  rank: ScoreRank;

  /**
   * Total score of the play.
   */
  totalScore: number;

  /**
   * Total accuracy of the play.
   */
  accuracy: number;

  /**
   * The performance of the play.
   */
  pp?: number;

  /**
   * Max combo of the play.
   */
  maxCombo: number;

  /**
   * Ruleset ID of the play.
   */
  rulesetID: number;

  /**
   * Whether the map was passed or not.
   */
  passed: boolean;

  /**
   * Ruleset instance.
   */
  ruleset?: IRuleset;

  /**
   * Mods of the play.
   */
  mods?: ModCombination;

  /**
   * Username of the player who set this play.
   */
  username: string;

  /**
   * User ID of the player who set this play.
   */
  userID: number;

  /**
   * Beatmap of the play.
   */
  beatmap: IBeatmap;

  /**
   * Beatmap ID.
   */
  beatmapID: number;

  /**
   * The date when this play was set.
   */
  date: Date;

  /**
   * Hit statistics.
   */
  statistics: Partial<IHitStatistics>;
}
