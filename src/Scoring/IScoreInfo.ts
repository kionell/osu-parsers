import { ScoreRank } from './Enums/ScoreRank';
import { IHitStatistics } from './IHitStatistics';
import { IBeatmapInfo } from '../Beatmaps';
import { IRuleset } from '../Rulesets';
import { ModCombination } from '../Mods';
import { IJsonableScoreInfo } from './IJsonableScoreInfo';

/**
 * A score information.
 */
export interface IScoreInfo {
  /**
   * A score ID.
   */
  id: number;

  /**
   * A rank of the play.
   */
  rank: keyof typeof ScoreRank;

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
  pp: number | null;

  /**
   * Max combo of the play.
   */
  maxCombo: number;

  /**
   * Whether the map was passed or not.
   */
  passed: boolean;

  /**
   * Perfect combo or not?
   */
  perfect: boolean;

  /**
   * Ruleset instance.
   */
  ruleset: IRuleset | null;

  /**
   * Ruleset ID of the play.
   */
  rulesetId: number;

  /**
   * Mods of the play.
   */
  mods: ModCombination | null;

  /**
   * Raw mods of the play.
   */
  rawMods: string | number;

  /**
   * Username of the player who set this play.
   */
  username: string;

  /**
   * User ID of the player who set this play.
   */
  userId: number;

  /**
   * Beatmap of the play.
   */
  beatmap: IBeatmapInfo | null;

  /**
   * Beatmap ID.
   */
  beatmapId: number;

  /**
   * The date when this play was set.
   */
  date: Date;

  /**
   * Hit statistics.
   */
  statistics: Partial<IHitStatistics>;

  /**
   * Beatmap MD5 hash.
   */
  beatmapHashMD5: string;

  /**
   * Number of Gekis in standard, Max 300s in mania.
   */
  countGeki: number;

  /**
   * Number of 300s.
   */
  count300: number;

  /**
   * Number of Katus in standard, 200s in mania.
   */
  countKatu: number;

  /**
   * Number of 100s in standard, 150s in Taiko, 100s in CTB, 100s in mania.
   */
  count100: number;

  /**
   * Number of 50s in standard, small fruit in CTB, 50s in mania.
   */
  count50: number;

  /**
   * Number of misses.
   */
  countMiss: number;

  /**
   * Total hits of a score.
   */
  totalHits: number;

  /**
   * Converts this score information to JSON.
   * @returns Score information convertable to JSON.
   */
  toJSON(): IJsonableScoreInfo;
}
