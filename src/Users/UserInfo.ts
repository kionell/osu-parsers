import { IUserInfo } from './IUserInfo';

/**
 * An user information.
 */
export class UserInfo implements IUserInfo {
  /**
   * User country code.
   */
  countryCode: Uppercase<string> = '';

  /**
   * User ID.
   */
  id = 0;

  /**
   * Whether the user is active or not.
   */
  isActive = false;

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
   * User's name.
   */
  username = '';

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
  globalRank = 0;

  /**
   * Rank in the country top.
   */
  countryRank = 0;

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

    return cloned;
  }

  /**
   * @param other Other user info.
   * @returns If two users are equal.
   */
  equals(other: IUserInfo): boolean {
    if (!other) return false;

    if (this.id !== 0 && other.id !== 0) {
      return this.id === other.id;
    }

    return false;
  }
}
