import { ModCombination } from '../Mods';
import { IRuleset } from '../Rulesets';

/**
 * A beatmap information.
 */
export interface IBeatmapInfo {
  /**
   * The beatmap ID.
   */
  id: number;

  /**
   * ID of beatmapset of this beatmap.
   */
  beatmapsetId: number;

  /**
   * The beatmap creator ID.
   */
  creatorId: number;

  /**
   * The beatmap creator username.
   */
  creator: string;

  /**
   * Number of the beatmap favourites.
   */
  favourites: number;

  /**
   * Number of passes of the beatmap.
   */
  passcount: number;

  /**
   * Number of playcount of the beatmap.
   */
  playcount: number;

  /**
   * Rank status of the beatmap (Graveyard, Loved, Ranked...)
   */
  status: number;

  /**
   * The beatmap title.
   */
  title: string;

  /**
   * The beatmap artist.
   */
  artist: string;

  /**
   * Difficulty name of the beatmap.
   */
  version: string;

  /**
   * Number of hittable objects of the beatmap.
   */
  hittable: number;

  /**
   * Number of slidable objects of the beatmap.
   */
  slidable: number;

  /**
   * Number of spinnable objects of the beatmap.
   */
  spinnable: number;

  /**
   * Number of holdable objects of the beatmap.
   */
  holdable: number;

  /**
   * Beatmap total hits.
   */
  totalHits: number;

  /**
   * Length of the beatmap in seconds.
   */
  length: number;

  /**
   * Minimal BPM of a beatmap.
   */
  bpmMin: number;

  /**
   * Maximal BPM of a beatmap.
   */
  bpmMax: number;

  /**
   * The most common BPM of a beatmap.
   */
  bpmMode: number;

  /**
   * Circle size of the beatmap.
   */
  circleSize: number;

  /**
   * Approach rate of the beatmap.
   */
  approachRate: number;

  /**
   * Overall difficulty of the beatmap.
   */
  overallDifficulty: number;

  /**
   * HP drain rate of the beatmap.
   */
  drainRate: number;

  /**
   * Ruleset instance.
   */
  ruleset: IRuleset | null;

  /**
   * The ruleset ID of this beatmap info.
   */
  rulesetId: number;

  /**
   * Mods of this beatmap info.
   */
  mods: ModCombination | null;

  /**
   * Raw mods of this beatmap info.
   */
  rawMods: string | number;

  /**
   * Total star rating of the beatmap.
   */
  starRating: number;

  /**
   * Max combo of the beatmap.
   */
  maxCombo: number;

  /**
   * If this beatmap info is for converted beatmap.
   */
  isConvert: boolean;

  /**
   * The date of the beatmap deletion.
   */
  deletedAt: Date | null;

  /**
   * The date of the last beatmap update.
   */
  updatedAt: Date | null;

  /**
   * Beatmap MD5 hash.
   */
  md5: string;
}
