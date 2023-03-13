/**
 * A class that represents rank history of a user.
 */
export class RankHistory {
  static DEFAULT_MODE = 'Unknown';

  /**
   * A mode to which this data belongs.
   */
  mode: string;

  /**
   * List of previous ranks at different points of history.
   */
  data: number[];

  /**
   * If this rank history has valid mode and more than 1 entry to build a graph.
   */
  get hasEnoughData(): boolean {
    return this.mode !== RankHistory.DEFAULT_MODE && this.data.length > 1;
  }

  constructor(mode?: string, data?: number[]) {
    this.mode = mode ?? RankHistory.DEFAULT_MODE;
    this.data = data ?? [];
  }

  /**
   * Creates a deep copy of the rank history.
   * @returns Cloned rank history.
   */
  clone(): RankHistory {
    return new RankHistory(this.mode, [...this.data]);
  }
}
