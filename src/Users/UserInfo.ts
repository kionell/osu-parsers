import { CountryCode } from './Enums/CountryCode';
import { Grades } from './Grades';
import { IJsonableUserInfo, JsonableUserInfo } from './IJsonableUserInfo';
import { IUserInfo } from './IUserInfo';
import { LevelInfo } from './LevelInfo';
import { RankHistory } from './RankHistory';

/**
 * A user information.
 */
export class UserInfo implements IUserInfo {
  /**
   * User ID.
   */
  id = 0;

  /**
   * User's name.
   */
  username = '';

  /**
   * User country code.
   */
  countryCode: keyof typeof CountryCode = 'Unknown';

  /**
   * Playmode of the user.
   */
  playmode = 0;

  /**
   * User performance points.
   */
  totalPerformance = 0;

  /**
   * Rank in the global top.
   */
  globalRank: number | null = null;

  /**
   * Rank in the country top.
   */
  countryRank: number | null = null;

  /**
   * Information about a user's level.
   */
  level = new LevelInfo();

  /**
   * Ranked score of a user.
   */
  rankedScore = 0;

  /**
   * Total score of a user.
   */
  totalScore = 0;

  /**
   * Total accuracy of a user.
   */
  accuracy = 0;

  /**
   * Total playcount of a user.
   */
  playcount = 0;

  /**
   * Total playtime of a user.
   */
  playtime = 0;

  /**
   * Total hits of a user.
   */
  totalHits = 0;

  /**
   * Max combo of a user.
   */
  maxCombo = 0;

  /**
   * How many times this user's replays have been watched.
   */
  replaysWatched = 0;

  /**
   * Grades count of a user.
   */
  grades = new Grades();

  /**
   * Rank history of a user.
   */
  rankHistory = new RankHistory();

  /**
   * Whether the user is active or not.
   */
  isActive = true;

  /**
   * Whether the user is bot or not.
   */
  isBot = false;

  /**
   * Whether the user is deleted or not.
   */
  isDeleted = false;

  /**
   * Whether the user is online or not.
   */
  isOnline = false;

  /**
   * Whether the user is supporter or not.
   */
  isSupporter = false;

  /**
   * Last visit date of the user.
   */
  lastVisitAt: Date | null = null;

  /**
   * Creates a new instance of a user information.
   * @param options The user information options.
   */
  constructor(options: Partial<IUserInfo> = {}) {
    Object.assign(this, options);
  }

  /**
   * Creates a new deep copy of a user info.
   * @returns Cloned user info.
   */
  clone(): this {
    const UserInfo = this.constructor as new (params?: Partial<IUserInfo>) => this;

    const cloned = new UserInfo();

    Object.assign(cloned, this);

    cloned.level = this.level.clone();
    cloned.rankHistory = this.rankHistory.clone();
    cloned.grades = new Grades(this.grades);
    cloned.lastVisitAt = this.lastVisitAt ? new Date(this.lastVisitAt) : null;

    return cloned;
  }

  /**
   * @param other Other user info.
   * @returns If two users are equal.
   */
  equals(other: IUserInfo): boolean {
    if (!other) return false;

    return this.id === other.id && this.username === other.username;
  }

  /**
   * Converts this user information to a plain object convertable to JSON.
   * @returns User information convertable to JSON.
   */
  toJSON(): IJsonableUserInfo {
    return {
      ...this as JsonableUserInfo,
      grades: this.grades.toJSON(),
      lastVisitAt: this.lastVisitAt ? this.lastVisitAt.getTime() / 1000 : null,
    };
  }

  /**
   * Converts raw JSON user information to an instance of {@link UserInfo}.
   * @param json Raw JSON user information.
   * @returns Adapted instance of {@link UserInfo} class.
   */
  static fromJSON(json: IJsonableUserInfo): UserInfo {
    return new UserInfo({
      ...json as JsonableUserInfo,
      level: new LevelInfo(json?.level?.current, json?.level?.progress),
      rankHistory: new RankHistory(json?.rankHistory?.mode, json?.rankHistory?.data),
      grades: Grades.fromJSON(json.grades),
      lastVisitAt: json.lastVisitAt ? new Date(json.lastVisitAt * 1000) : null,
    });
  }
}
