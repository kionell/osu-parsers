export interface ITestAttributes {
  maxCombo: number;
  approachRate: number;
  starRating: number;
  totalPerformance: number;
}

export interface IModdedAttributes {
  [key: string]: ITestAttributes;
}
