import { IJsonableBeatmapInfo } from '../Beatmaps';
import { IScoreInfo } from './IScoreInfo';

export type JsonableScoreInfo = Omit<IScoreInfo, 'beatmap' | 'ruleset' | 'mods' | 'rawMods'>;

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
}
