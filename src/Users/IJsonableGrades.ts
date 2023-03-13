import { ScoreRank } from '../Scoring';

export type IJsonableGrades = Partial<Record<keyof typeof ScoreRank, number>>;
