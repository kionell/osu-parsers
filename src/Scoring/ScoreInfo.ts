import { Beatmap, IBeatmap } from '../Beatmaps';
import { IRuleset } from '../Rulesets';
import { ModCombination } from '../Mods';
import { ScoreRank } from './Enums/ScoreRank';

interface IParams {
  beatmap: IBeatmap;
  mods: ModCombination;
  maxCombo: number;
  great: number;
  ok: number;
  meh: number;
  miss: number;
  accuracy: number;
}

/**
 * A score info.
 */
export class ScoreInfo {
  /**
   * A score ID.
   */
  id = 0;

  /**
   * A rank of the play.
   */
  rank: ScoreRank = ScoreRank.F;

  /**
   * Total score of the play.
   */
  totalScore = 0;

  /**
   * Total accuracy of the play.
   */
  accuracy = 0;

  /**
   * The performance of the play.
   */
  pp?: number;

  /**
   * Max combo of the play.
   */
  maxCombo = 0;

  /**
   * Ruleset ID of the play.
   */
  rulesetID = 0;

  /**
   * Whether the map was passed or not.
   */
  passed = true;

  /**
   * Ruleset instance.
   */
  ruleset?: IRuleset;

  /**
   * Mods of the play.
   */
  mods?: ModCombination;

  /**
   * Username of the player who set this play.
   */
  username = '';

  /**
   * User ID of the player who set this play.
   */
  userID = 0;

  /**
   * Beatmap of the play.
   */
  beatmap: IBeatmap = new Beatmap();

  /**
   * The date when this play was set.
   */
  date: Date = new Date();

  /**
   * Hit statistics.
   */
  statistics: IHitStatistics = {
    none: 0,
    miss: 0,
    meh: 0,
    ok: 0,
    good: 0,
    great: 0,
    perfect: 0,
    smallTickMiss: 0,
    smallTickHit: 0,
    largeTickMiss: 0,
    largeTickHit: 0,
    smallBonus: 0,
    largeBonus: 0,
    ignoreMiss: 0,
    ignoreHit: 0,
  };

  /**
   * Hash of the beatmap.
   */
  hash = '';

  /**
   * Possible constructor.
   * @param beatmap Beatmap of the play.
   * @param maxCombo Max combo of the play.
   * @param great Count of 300x. 
   * @param ok Count of 100x.
   * @param meh Count of 50x.
   * @param miss Count of misses.
   * @param accuracy Total accuracy of the play.
   * @param mods Mods of the play.
   */
  constructor({ beatmap, maxCombo, great, ok, meh, miss, accuracy, mods } : Partial<IParams> = {}) {
    if (beatmap) this.beatmap = beatmap;
    if (maxCombo) this.maxCombo = maxCombo;
    if (great) this.statistics.great = great;
    if (ok) this.statistics.ok = ok;
    if (meh) this.statistics.meh = meh;
    if (miss) this.statistics.miss = miss;
    if (accuracy) this.accuracy = accuracy;
    if (mods) this.mods = mods;
  }

  /**
   * Creates a deep copy of the score info.
   * @returns Cloned score info.
   */
  clone(): ScoreInfo {
    const cloned = new ScoreInfo();

    cloned.id = this.id;
    cloned.rank = this.rank;
    cloned.totalScore = this.totalScore;
    cloned.accuracy = this.accuracy;
    cloned.maxCombo = this.maxCombo;
    cloned.rulesetID = this.rulesetID;
    cloned.passed = this.passed;
    cloned.ruleset = this.ruleset;
    cloned.mods = this.mods;
    cloned.username = this.username;
    cloned.userID = this.userID;
    cloned.beatmap = this.beatmap;
    cloned.date = this.date;
    cloned.hash = this.hash;

    if (this.pp) cloned.pp = this.pp;

    cloned.statistics = { ...this.statistics };

    return cloned;
  }

  /**
   * @param other Other score info.
   * @returns If two scores are equal.
   */
  equals(other: ScoreInfo): boolean {
    if (!other) return false;

    if (this.id !== 0 && other.id !== 0) {
      return this.id === other.id;
    }

    if (!this.hash && !other.hash) {
      return this.hash === other.hash;
    }

    return false;
  }
}
