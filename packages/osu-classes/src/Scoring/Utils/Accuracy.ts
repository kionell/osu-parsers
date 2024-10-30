import { clamp01 } from '../../Utils/MathUtils';
import { IScoreInfo } from '../IScoreInfo';

/**
 * Calculates accuracy of a score.
 * @param scoreInfo Score information.
 * @returns Calculated accuracy.
 */
export function calculate(scoreInfo: IScoreInfo): number {
  const geki = scoreInfo.countGeki;
  const katu = scoreInfo.countKatu;
  const n300 = scoreInfo.count300;
  const n100 = scoreInfo.count100;
  const n50 = scoreInfo.count50;
  const total = scoreInfo.totalHits;

  if (total <= 0) return 1;

  switch (scoreInfo.rulesetId) {
    case 0:
      return clamp01((n50 / 6 + n100 / 3 + n300) / total);

    case 1:
      return clamp01((n100 / 2 + n300) / total);

    case 2:
      return clamp01((n50 + n100 + n300) / total);

    case 3:
      return clamp01((n50 / 6 + n100 / 3 + katu / 1.5 + (n300 + geki)) / total);
  }

  return 1;
}
