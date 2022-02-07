import { IBeatmap } from '../Beatmaps';
import { IRuleset } from '../Rulesets';
import { ModCombination } from '../Mods';
import { ScoreRank } from './Enums/ScoreRank';
import { IHitStatistics } from './IHitStatistics';
import { IScoreInfo } from './IScoreInfo';

/**
 * A score information.
 */
export class ScoreInfo implements IScoreInfo {
  /**
   * A score ID.
   */
  id = 0;

  /**
   * A rank of the play.
   */
  rank: keyof typeof ScoreRank = 'F';

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
  rulesetId = 0;

  /**
   * Whether the map was passed or not.
   */
  passed = false;

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
  userId = 0;

  /**
   * Beatmap of the play.
   */
  beatmap: IBeatmap | null = null;

  /**
   * Beatmap ID.
   */
  beatmapId = 0;

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
   * Creates a new instance of score information.
   * @param options The score information options.
   */
  constructor(options: Partial<IScoreInfo> = {}) {
    Object.assign(this, options);
  }

  /**
   * Creates a deep copy of the score info.
   * @returns Cloned score info.
   */
  clone(): this {
    const ScoreInfo = this.constructor as new (params?: Partial<IScoreInfo>) => this;

    const cloned = new ScoreInfo();

    cloned.id = this.id;
    cloned.rank = this.rank;
    cloned.totalScore = this.totalScore;
    cloned.accuracy = this.accuracy;
    cloned.maxCombo = this.maxCombo;
    cloned.rulesetId = this.rulesetId;
    cloned.passed = this.passed;
    cloned.ruleset = this.ruleset;
    cloned.mods = this.mods;
    cloned.username = this.username;
    cloned.userId = this.userId;
    cloned.beatmap = this.beatmap;
    cloned.beatmapId = this.beatmapId;
    cloned.date = this.date;

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

    return false;
  }
}
