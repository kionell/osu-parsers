/**
 * An user information.
 */
export interface IUserInfo {
  /**
   * User country code.
   */
  countryCode: Uppercase<string>;

  /**
   * User ID.
   */
  id: number;

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

  /**
   * User's name.
   */
  username: string;

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
  globalRank: number;

  /**
   * Rank in the country top.
   */
  countryRank: number;
}
