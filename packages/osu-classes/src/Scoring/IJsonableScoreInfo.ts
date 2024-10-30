import { IJsonableBeatmapInfo } from '../Beatmaps';
import { IJsonableHitStatistics } from './IJsonableHitStatistics';
import { IScoreInfo } from './IScoreInfo';

export type JsonableScoreInfo = Omit<
// eslint-disable-next-line @typescript-eslint/indent
  IScoreInfo,
// eslint-disable-next-line @typescript-eslint/indent
  'beatmap' | 'ruleset' | 'mods' | 'rawMods' | 'statistics' | 'date'
>;

/**
 * A score information that can be converted to JSON.
 */
export interface IJsonableScoreInfo extends JsonableScoreInfo {
  /**
   * Stringified mods of the play.
   */
  mods: string;

  /**
   * A beatmap information that can be converted to JSON.
   */
  beatmap: IJsonableBeatmapInfo | null;

  /**
   * Hit statistics that can be converted to JSON.
   */
  statistics: IJsonableHitStatistics;

  /**
   * Timestamp when this play was set.
   */
  date: number;
}
