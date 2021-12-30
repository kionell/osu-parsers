import { IModdedValues } from './IModdedValues';

export interface IBeatmapValues {
  hittable: number;
  slidable: number;
  spinnable: number;
  objects: number;
  maxCombo: number;
  moddedValues: IModdedValues[];
}
