import { IBeatmapInfo } from './IBeatmapInfo';

export type JsonableBeatmapInfo = Omit<IBeatmapInfo, 'beatmap' | 'ruleset' | 'mods' | 'rawMods'>;

/**
 * A beatmap information that can be converted to JSON.
 */
export interface IJsonableBeatmapInfo extends JsonableBeatmapInfo {
  /**
   * Stringified mods of the play.
   */
  mods: string;

}
