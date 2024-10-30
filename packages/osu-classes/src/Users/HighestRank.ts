/**
 * A highest rank information that can be converted to JSON.
 */
export interface IJsonableHighestRank {
  /**
   * Highest rank of the user.
   */
  rank: number;

  /**
   * Timestamp of the date when this rank was achieved.
   */
  updatedAt: number;
}

/**
 * A class that represents highest rank of the user.
 */
export class HighestRank {
  /**
   * Highest rank of the user.
   */
  rank: number;

  /**
   * The date when highest rank was achieved.
   */
  updatedAt: Date;

  constructor(options?: Partial<HighestRank>) {
    this.rank = options?.rank ?? 0;
    this.updatedAt = options?.updatedAt ?? new Date();
  }

  /**
   * Creates a deep copy of the highest rank instance.
   * @returns Cloned highest rank instance.
   */
  clone(): HighestRank {
    return new HighestRank(this);
  }

  /**
   * Converts this map to a readable JSON format.
   */
  toJSON(): IJsonableHighestRank {
    return {
      rank: this.rank,
      updatedAt: this.updatedAt.getTime() / 1000,
    };
  }

  static fromJSON(json: IJsonableHighestRank): HighestRank {
    return new HighestRank({
      rank: json.rank,
      updatedAt: json.updatedAt ? new Date(json.updatedAt * 1000) : new Date(),
    });
  }
}
