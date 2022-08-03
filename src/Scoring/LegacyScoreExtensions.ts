import { IHitStatistics } from './IHitStatistics';

/**
 * Score extensions.
 */
export abstract class LegacyScoreExtensions {
  /**
   * Ruleset ID of the play.
   */
  abstract rulesetId: number;

  /**
   * Hit statistics.
   */
  abstract statistics: Partial<IHitStatistics>;

  /**
   * This is only stored for legacy scores. 
   * Currently osu!stable uses Geki & Katu in osu!standard.
   * New osu!lazer score format just ignores that data.
   */
  private _legacyCountGeki = 0;
  private _legacyCountKatu = 0;

  /**
   * Number of Gekis in standard, Max 300s in mania.
   */
  get countGeki(): number {
    if (this.rulesetId === 3) {
      return this.statistics?.perfect ?? this._legacyCountGeki;
    }

    return this._legacyCountGeki;
  }

  set countGeki(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 3) {
      this.statistics.perfect = value;
    }

    this._legacyCountGeki = value;
  }

  /**
   * Number of 300s.
   */
  get count300(): number {
    return this.statistics?.great ?? 0;
  }

  set count300(value: number) {
    if (!this.statistics) return;

    this.statistics.great = value;
  }

  /**
   * Number of Katus in standard, 200s in mania.
   */
  get countKatu(): number {
    if (this.rulesetId === 2) {
      return this.statistics?.smallTickMiss ?? this._legacyCountKatu;
    }

    if (this.rulesetId === 3) {
      return this.statistics?.good ?? this._legacyCountKatu;
    }

    return this._legacyCountKatu;
  }

  set countKatu(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.smallTickMiss = value;
    }

    if (this.rulesetId === 3) {
      this.statistics.good = value;
    }

    this._legacyCountKatu = value;
  }

  /**
   * Number of 100s in standard, 150s in Taiko, 100s in CTB, 100s in mania.
   */
  get count100(): number {
    if (this.rulesetId === 2) {
      return this.statistics?.largeTickHit ?? 0;
    }

    return this.statistics?.ok ?? 0;
  }

  set count100(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.largeTickHit = value;
    }

    this.statistics.ok = value;
  }

  /**
   * Number of 50s in standard, small fruit in CTB, 50s in mania.
   */
  get count50(): number {
    if (this.rulesetId === 2) {
      return this.statistics?.smallTickHit ?? 0;
    }

    return this.statistics?.meh ?? 0;
  }

  set count50(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.smallTickHit = value;
    }

    this.statistics.meh = value;
  }

  /**
   * Number of misses.
   */
  get countMiss(): number {
    return this.statistics?.miss ?? 0;
  }

  set countMiss(value: number) {
    if (!this.statistics) return;

    this.statistics.miss = value;
  }

  /**
   * Total hits of a score.
   */
  get totalHits(): number {
    const geki = this.countGeki;
    const katu = this.countKatu;
    const c300 = this.count300;
    const c100 = this.count100;
    const c50 = this.count50;
    const miss = this.countMiss;

    switch (this.rulesetId) {
      case 0: return c50 + c100 + c300 + miss;
      case 1: return c100 + c300 + miss;
      case 2: return c50 + c100 + c300 + miss + katu;
      case 3: return c50 + c100 + c300 + miss + geki + katu;
    }

    return geki + katu + c300 + c100 + c50 + miss;
  }
}
