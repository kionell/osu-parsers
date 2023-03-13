import { IJsonableBeatmapInfo } from '../Beatmaps';
import { IJsonableHitStatistics } from './IJsonableHitStatistics';
import { IScoreInfo } from './IScoreInfo';

export type JsonableScoreInfo = Omit<IScoreInfo, 'beatmap' | 'ruleset' | 'mods' | 'rawMods' | 'statistics'>;

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
}
