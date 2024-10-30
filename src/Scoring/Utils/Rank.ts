import { IScoreInfo } from '../IScoreInfo';
import { ScoreRank } from '../Enums/ScoreRank';
import { ModBitwise } from '../../Mods';

/**
 * Calculates rank of a score.
 * @param scoreInfo Score information.
 * @returns Calculated score rank.
 */
export function calculate(scoreInfo: IScoreInfo): keyof typeof ScoreRank {
  if (!scoreInfo.passed) return 'F';

  switch (scoreInfo.rulesetId) {
    case 0: return calculateOsuRank(scoreInfo);
    case 1: return calculateTaikoRank(scoreInfo);
    case 2: return calculateCatchRank(scoreInfo);
    case 3: return calculateManiaRank(scoreInfo);
  }

  return 'F';
}

/**
 * Calculates rank of an osu!standard score.
 * @param scoreInfo Score information.
 * @returns Calculated osu!std score rank.
 */
function calculateOsuRank(scoreInfo: IScoreInfo): keyof typeof ScoreRank {
  const { count300, count50, countMiss, totalHits } = scoreInfo;

  const ratio300 = Math.fround(count300 / totalHits);
  const ratio50 = Math.fround(count50 / totalHits);

  if (ratio300 === 1) {
    return shouldBeSilverRank(scoreInfo) ? 'XH' : 'X';
  }

  if (ratio300 > 0.9 && ratio50 <= 0.01 && countMiss === 0) {
    return shouldBeSilverRank(scoreInfo) ? 'SH' : 'S';
  }

  if ((ratio300 > 0.8 && countMiss === 0) || ratio300 > 0.9) {
    return 'A';
  }

  if ((ratio300 > 0.7 && countMiss === 0) || ratio300 > 0.8) {
    return 'B';
  }

  return ratio300 > 0.6 ? 'C' : 'D';
}

/**
 * Calculates rank of an osu!taiko score.
 * @param scoreInfo Score information.
 * @returns Calculated osu!taiko score rank.
 */
function calculateTaikoRank(scoreInfo: IScoreInfo): keyof typeof ScoreRank {
  const { count300, count50, countMiss, totalHits } = scoreInfo;

  const ratio300 = Math.fround(count300 / totalHits);
  const ratio50 = Math.fround(count50 / totalHits);

  if (ratio300 === 1) {
    return shouldBeSilverRank(scoreInfo) ? 'XH' : 'X';
  }

  if (ratio300 > 0.9 && ratio50 <= 0.01 && countMiss === 0) {
    return shouldBeSilverRank(scoreInfo) ? 'SH' : 'S';
  }

  if ((ratio300 > 0.8 && countMiss === 0) || ratio300 > 0.9) {
    return 'A';
  }

  if ((ratio300 > 0.7 && countMiss === 0) || ratio300 > 0.8) {
    return 'B';
  }

  return ratio300 > 0.6 ? 'C' : 'D';
}

/**
 * Calculates rank of an osu!catch score.
 * @param scoreInfo Score information.
 * @returns Calculated osu!catch score rank.
 */
function calculateCatchRank(scoreInfo: IScoreInfo): keyof typeof ScoreRank {
  const accuracy = scoreInfo.accuracy;

  if (accuracy === 1) {
    return shouldBeSilverRank(scoreInfo) ? 'XH' : 'X';
  }

  if (accuracy > 0.98) {
    return shouldBeSilverRank(scoreInfo) ? 'SH' : 'S';
  }

  if (accuracy > 0.94) return 'A';
  if (accuracy > 0.90) return 'B';
  if (accuracy > 0.85) return 'C';

  return 'D';
}

/**
 * Calculates rank of an osu!mania score.
 * @param scoreInfo Score information.
 * @returns Calculated osu!mania score rank.
 */
function calculateManiaRank(scoreInfo: IScoreInfo): keyof typeof ScoreRank {
  const accuracy = scoreInfo.accuracy;

  if (accuracy === 1) {
    return shouldBeSilverRank(scoreInfo) ? 'XH' : 'X';
  }

  if (accuracy > 0.95) {
    return shouldBeSilverRank(scoreInfo) ? 'SH' : 'S';
  }

  if (accuracy > 0.9) return 'A';
  if (accuracy > 0.8) return 'B';
  if (accuracy > 0.7) return 'C';

  return 'D';
}

function shouldBeSilverRank(scoreInfo: IScoreInfo): boolean {
  if (scoreInfo.mods) {
    return scoreInfo.mods.has('HD') || scoreInfo.mods.has('FL');
  }

  if (typeof scoreInfo.rawMods === 'number') {
    const hasHidden = (scoreInfo.rawMods & ModBitwise.Hidden) > 0;
    const hasFlashlight = (scoreInfo.rawMods & ModBitwise.Flashlight) > 0;

    return hasHidden || hasFlashlight;
  }

  if (typeof scoreInfo.rawMods === 'string') {
    const acronyms = scoreInfo.rawMods
      .match(/.{1,2}/g)?.map((a) => a.toUpperCase()) ?? [];

    return acronyms.includes('HD') || acronyms.includes('FL');
  }

  return false;
}
