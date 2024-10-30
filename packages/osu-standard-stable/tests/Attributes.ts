export interface ITestAttributes {
  maxCombo: number;
  starRating: number;
  aimDifficulty: number;
  speedDifficulty: number;
  speedNoteCount: number;
  flashlightDifficulty: number;
  sliderFactor: number;
  approachRate: number;
  overallDifficulty: number;
  totalPerformance: number;
  aimPerformance: number;
  speedPerformance: number;
  accuracyPerformance: number;
  flashlightPerformance: number;
  effectiveMissCount: number;
}

export interface IModdedAttributes {
  [key: string]: ITestAttributes;
}
