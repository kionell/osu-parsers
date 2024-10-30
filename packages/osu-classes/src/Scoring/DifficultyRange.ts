import { HitResult } from './Enums/HitResult';

export class DifficultyRange {
  readonly result: HitResult;

  min: number;
  average: number;
  max: number;

  constructor(result: HitResult, min: number, average: number, max: number) {
    this.result = result;
    this.min = min;
    this.average = average;
    this.max = max;
  }

  /**
   * Maps a difficulty value [0, 10] to a two-piece linear range of values.
   * @param difficulty The difficulty value to be mapped.
   * @param min Minimum of the resulting range which will be achieved by a difficulty value of 0.
   * @param mid Midpoint of the resulting range which will be achieved by a difficulty value of 5.
   * @param max Maximum of the resulting range which will be achieved by a difficulty value of 10.
   * @returns Value to which the difficulty value maps in the specified range.
   */
  static map(difficulty: number, min: number, mid: number, max: number): number {
    if (difficulty > 5) {
      return mid + (max - mid) * (difficulty - 5) / 5;
    }

    if (difficulty < 5) {
      return mid - (mid - min) * (5 - difficulty) / 5;
    }

    return mid;
  }
}
