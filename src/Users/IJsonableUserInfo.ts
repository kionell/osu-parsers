import { IJsonableGrades } from './IJsonableGrades';
import { IUserInfo } from './IUserInfo';

export type JsonableUserInfo = Omit<IUserInfo, 'grades' | 'lastVisitAt'>;

export interface IJsonableUserInfo extends JsonableUserInfo {
  /**
   * Grades count of a user.
   */
  grades: IJsonableGrades;

  /**
   * Timestamp of last visit of the user.
   */
  lastVisitAt: number | null;
}
