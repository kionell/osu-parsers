import { ScoreRank } from '../Scoring';

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
}
