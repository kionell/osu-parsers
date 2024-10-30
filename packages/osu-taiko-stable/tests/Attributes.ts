export interface ITestAttributes {
  maxCombo: number;
  starRating: number;
  staminaDifficulty: number;
  rhythmDifficulty: number;
  colourDifficulty: number;
  peakDifficulty: number;
  greatHitWindow: number;
  totalPerformance: number;
  difficultyPerformance: number;
  accuracyPerformance: number;
  effectiveMissCount: number;
}

export interface IModdedAttributes {
  [key: string]: ITestAttributes;
}
