import { IBeatmapInfo } from './IBeatmapInfo';
import { ModCombination } from '../Mods';
import { IRuleset } from '../Rulesets';

/**
 * A beatmap inforamtion.
 */
export class BeatmapInfo implements IBeatmapInfo {
  /**
   * The beatmap ID.
   */
  id = 0;

  /**
   * ID of beatmapset of this beatmap.
   */
  beatmapsetId = 0;

  /**
   * The beatmap creator ID.
   */
  creatorId = 0;

  /**
   * The beatmap creator username.
   */
  creator = '';

  /**
   * Number of the beatmap favourites.
   */
  favourites = 0;

  /**
   * Number of passes of the beatmap.
   */
  passcount = 0;

  /**
   * Number of playcount of the beatmap.
   */
  playcount = 0;

  /**
   * Rank status of the beatmap (Graveyard, Loved, Ranked...)
   */
  status = -2;

  /**
   * The beatmap title.
   */
  title = 'Unknown title';

  /**
   * The beatmap artist.
   */
  artist = 'Unknown artist';

  /**
   * Difficulty name of the beatmap.
   */
  version = 'Normal';

  /**
   * Number of hittable objects of the beatmap.
   */
  hittable = 0;

  /**
   * Number of slidable objects of the beatmap.
   */
  slidable = 0;

  /**
   * Number of spinnable objects of the beatmap.
   */
  spinnable = 0;

  /**
   * Number of holdable objects of the beatmap.
   */
  holdable = 0;

  /**
   * Length of the beatmap in seconds.
   */
  length = 0;

  /**
   * Circle size of the beatmap.
   */
  circleSize = 0;

  /**
   * Approach rate of the beatmap.
   */
  approachRate = 0;

  /**
   * Overall difficulty of the beatmap.
   */
  overallDifficulty = 0;

  /**
   * HP drain rate of the beatmap.
   */
  drainRate = 0;

  /**
   * The ruleset ID of this beatmap info.
   */
  rulesetId = 0;

  /**
   * Ruleset instance.
   */
  ruleset?: IRuleset;

  /**
   * Mods of the play.
   */
  mods?: ModCombination;

  /**
   * Total star rating of the beatmap.
   */
  starRating = 0;

  /**
   * Max combo of the beatmap.
   */
  maxCombo = 0;

  /**
   * If this beatmap info is for converted beatmap.
   */
  isConvert = false;

  /**
   * The date of the beatmap deletion.
   */
  deletedAt: Date | null = null;

  /**
   * The date of the last beatmap update.
   */
  updatedAt: Date | null = null;

  /**
   * Creates a new instance of a beatmap information.
   * @param options The beatmap information options.
   */
  constructor(options: Partial<IBeatmapInfo> = {}) {
    Object.assign(this, options);
  }

  /**
   * Creates a new deep copy of a beatmap info.
   * @returns Cloned beatmap info.
   */
  clone(): this {
    const BeatmapInfo = this.constructor as new (params?: Partial<IBeatmapInfo>) => this;

    const cloned = new BeatmapInfo();

    Object.assign(cloned, this);

    return cloned;
  }

  /**
   * @param other Other beatmap info.
   * @returns If two beatmaps are equal.
   */
  equals(other: IBeatmapInfo): boolean {
    if (!other) return false;

    if (this.id !== 0 && other.id !== 0) {
      return this.id === other.id;
    }

    return false;
  }

  get totalObjects(): number {
    return this.hittable + this.slidable + this.spinnable + this.holdable;
  }
}
