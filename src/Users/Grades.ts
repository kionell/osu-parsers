import { ScoreRank } from '../Scoring';
import { IJsonableGrades } from './IJsonableGrades';

/**
 * A special case of a map structure for storing the number of user's grades.
 */
export class Grades extends Map<ScoreRank, number> {
  /**
   * Gets the number of grades by their type.
   * If grade is not present sets it to default value and returns it.
   * @param key Score rank type.
   * @returns The number of grades of this type.
   */
  get(key: ScoreRank): number {
    if (!super.has(key)) super.set(key, 0);

    return super.get(key) as number;
  }

  /**
   * If user has zero grades in total.
   */
  get hasZeroGrades(): boolean {
    return this.size === 0 || [...this.values()].reduce((p, c) => p + c) === 0;
  }

  /**
   * Converts this map to a readable JSON format.
   */
  toJSON(): IJsonableGrades {
    const result: IJsonableGrades = {};

    this.forEach((value, key) => {
      result[ScoreRank[key] as keyof typeof ScoreRank] = value;
    });

    return result;
  }

  static fromJSON(json: IJsonableGrades): Grades {
    const statistics = new Grades();
    const entries = Object.entries(json);

    entries.forEach((entry) => {
      const key = entry[0] as keyof typeof ScoreRank;

      statistics.set(ScoreRank[key], entry[1]);
    });

    return statistics;
  }
}
