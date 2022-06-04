import { IBeatmapValues } from './IBeatmapValues';
import { IPerformances } from './IPerformances';
import { IStarRatings } from './IStarRatings';

export interface ILoadedFiles {
  values: IBeatmapValues,
  stars: IStarRatings,
  performances: IPerformances,
}
