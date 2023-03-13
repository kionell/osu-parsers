import { IBeatmapInfo } from './IBeatmapInfo';

export type JsonableBeatmapInfo = Omit<
// eslint-disable-next-line @typescript-eslint/indent
  IBeatmapInfo,
// eslint-disable-next-line @typescript-eslint/indent
  'ruleset' | 'mods' | 'rawMods' | 'deletedAt' | 'updatedAt'
>;

/**
 * A beatmap information that can be converted to JSON.
 */
export interface IJsonableBeatmapInfo extends JsonableBeatmapInfo {
  /**
   * Stringified mods of the play.
   */
  mods: string;

  /**
   * Timestamp of the beatmap deletion.
   */
  deletedAt: number | null;

  /**
   * Timestamp of the last beatmap update.
   */
  updatedAt: number | null;
}
