import { HitResult } from './Enums/HitResult';
import { HitStatistics } from './HitStatistics';

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
  statistics = new HitStatistics();

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
      return this.statistics.has(HitResult.Perfect)
        ? this.statistics.get(HitResult.Perfect)
        : this._legacyCountGeki;
    }

    return this._legacyCountGeki;
  }

  set countGeki(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 3) {
      this.statistics.set(HitResult.Perfect, value);
    }

    this._legacyCountGeki = value;
  }

  /**
   * Number of 300s.
   */
  get count300(): number {
    return this.statistics.get(HitResult.Great);
  }

  set count300(value: number) {
    if (!this.statistics) return;

    this.statistics.set(HitResult.Great, value);
  }

  /**
   * Number of Katus in standard, 200s in mania.
   */
  get countKatu(): number {
    if (this.rulesetId === 2) {
      return this.statistics.has(HitResult.SmallTickMiss)
        ? this.statistics.get(HitResult.SmallTickMiss)
        : this._legacyCountKatu;
    }

    if (this.rulesetId === 3) {
      return this.statistics.has(HitResult.Good)
        ? this.statistics.get(HitResult.Good)
        : this._legacyCountKatu;
    }

    return this._legacyCountKatu;
  }

  set countKatu(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.set(HitResult.SmallTickMiss, value);
    }

    if (this.rulesetId === 3) {
      this.statistics.set(HitResult.Good, value);
    }

    this._legacyCountKatu = value;
  }

  /**
   * Number of 100s in standard, 150s in Taiko, 100s in CTB, 100s in mania.
   */
  get count100(): number {
    if (this.rulesetId === 2) {
      return this.statistics.get(HitResult.LargeTickHit);
    }

    return this.statistics.get(HitResult.Ok);
  }

  set count100(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.set(HitResult.LargeTickHit, value);
    }

    this.statistics.set(HitResult.Ok, value);
  }

  /**
   * Number of 50s in standard, small fruit in CTB, 50s in mania.
   */
  get count50(): number {
    if (this.rulesetId === 2) {
      return this.statistics.get(HitResult.SmallTickHit);
    }

    return this.statistics.get(HitResult.Meh);
  }

  set count50(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.set(HitResult.SmallTickHit, value);
    }

    this.statistics.set(HitResult.Meh, value);
  }

  /**
   * Number of misses.
   */
  get countMiss(): number {
    return this.statistics.get(HitResult.Miss);
  }

  set countMiss(value: number) {
    if (!this.statistics) return;

    this.statistics.set(HitResult.Miss, value);
  }

  /**
   * Total hits of a score.
   */
  get totalHits(): number {
    const geki = this.countGeki;
    const katu = this.countKatu;
    const n300 = this.count300;
    const n100 = this.count100;
    const n50 = this.count50;
    const miss = this.countMiss;

    switch (this.rulesetId) {
      case 0: return n300 + n100 + n50 + miss;
      case 1: return n300 + n100 + n50 + miss;
      case 2: return n300 + katu + n100 + n50 + miss;
      case 3: return geki + n300 + katu + n100 + n50 + miss;
    }

    return geki + n300 + katu + n100 + n50 + miss;
  }
}
