import { CountryCode } from './Enums/CountryCode';
import { Grades } from './Grades';
import { LevelInfo } from './LevelInfo';
import { RankHistory } from './RankHistory';

/**
 * A user information.
 */
export interface IUserInfo {
  /**
   * User ID.
   */
  id: number;

  /**
   * User's name.
   */
  username: string;

  /**
   * User country code.
   */
  countryCode: keyof typeof CountryCode;

  /**
   * Playmode of the user.
   */
  playmode: number;

  /**
   * User performance points.
   */
  totalPerformance: number;

  /**
   * Rank in the global top.
   */
  globalRank: number | null;

  /**
   * Rank in the country top.
   */
  countryRank: number | null;

  /**
   * Information about a user's level.
   */
  level: LevelInfo;

  /**
   * Ranked score of a user.
   */
  rankedScore: number;

  /**
   * Total score of a user.
   */
  totalScore: number;

  /**
   * Total accuracy of a user.
   */
  accuracy: number;

  /**
   * Total playcount of a user.
   */
  playcount: number;

  /**
   * Total playtime of a user.
   */
  playtime: number;

  /**
   * Total hits of a user.
   */
  totalHits: number;

  /**
   * Max combo of a user.
   */
  maxCombo: number;

  /**
   * How many times this user's replays have been watched.
   */
  replaysWatched: number;

  /**
   * Grades count of a user.
   */
  grades: Grades;

  /**
   * Rank history of a user.
   */
  rankHistory: RankHistory;

  /**
   * Whether the user is active or not.
   */
  isActive: boolean;

  /**
   * Whether the user is bot or not.
   */
  isBot: boolean;

  /**
   * Whether the user is deleted or not.
   */
  isDeleted: boolean;

  /**
   * Whether the user is online or not.
   */
  isOnline: boolean;

  /**
   * Whether the user is supporter or not.
   */
  isSupporter: boolean;

  /**
   * Last visit date of the user.
   */
  lastVisitAt: Date | null;
}
