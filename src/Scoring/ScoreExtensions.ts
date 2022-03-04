import { ScoreRank } from './Enums/ScoreRank';
import { IHitStatistics } from './IHitStatistics';
import { ModCombination } from '../Mods';

/**
 * Score extensions.
 */
export abstract class ScoreExtensions {
  /**
   * Ruleset ID of the play.
   */
  abstract rulesetId: number;

  /**
   * Hit statistics.
   */
  abstract statistics: Partial<IHitStatistics>;

  /**
   * Whether the map was passed or not.
   */
  abstract passed: boolean;

  /**
   * Mods of the play.
   */
  abstract mods: ModCombination | null;

  /**
   * Number of Gekis in standard, Max 300s in mania.
   */
  get countGeki(): number {
    if (this.rulesetId === 3) {
      return this.statistics?.perfect ?? 0;
    }

    return 0;
  }

  set countGeki(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 3) {
      this.statistics.perfect = value;
    }
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
      return this.statistics?.smallTickMiss ?? 0;
    }

    if (this.rulesetId === 3) {
      return this.statistics?.good ?? 0;
    }

    return 0;
  }

  set countKatu(value: number) {
    if (!this.statistics) return;

    if (this.rulesetId === 2) {
      this.statistics.smallTickMiss = value;
    }

    if (this.rulesetId === 3) {
      this.statistics.good = value;
    }
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

    return 0;
  }

  /**
   * Score accuracy
   */
  get accuracy(): number {
    const geki = this.countGeki;
    const katu = this.countKatu;
    const c300 = this.count300;
    const c100 = this.count100;
    const c50 = this.count50;
    const total = this.totalHits;

    if (total <= 0) return 1;

    switch (this.rulesetId) {
      case 0:
        return (c50 / 6 + c100 / 3 + c300) / total;

      case 1:
        return (c100 / 2 + c300) / total;

      case 2:
        return (c50 + c100 + c300) / total;

      case 3:
        return (c50 / 6 + c100 / 3 + katu / 1.5 + (c300 + geki)) / total;
    }

    return 1;
  }

  /**
   * A score rank.
   */
  get rank(): keyof typeof ScoreRank {
    if (!this.passed) {
      return ScoreRank[ScoreRank.F] as keyof typeof ScoreRank;
    }

    switch (this.rulesetId) {
      case 0:
        return ScoreRank[this._osuScoreRank] as keyof typeof ScoreRank;

      case 1:
        return ScoreRank[this._taikoScoreRank] as keyof typeof ScoreRank;

      case 2:
        return ScoreRank[this._catchScoreRank] as keyof typeof ScoreRank;

      case 3:
        return ScoreRank[this._maniaScoreRank] as keyof typeof ScoreRank;
    }

    return ScoreRank[ScoreRank.F] as keyof typeof ScoreRank;
  }

  /**
   * osu!standard score rank.
   */
  private get _osuScoreRank(): ScoreRank {
    const hasFL = this.mods?.has('FL') ?? false;
    const hasHD = this.mods?.has('HD') ?? false;

    const ratio300 = Math.fround(this.count300 / this.totalHits);
    const ratio50 = Math.fround(this.count50 / this.totalHits);

    if (ratio300 === 1) {
      return hasHD || hasFL ? ScoreRank.XH : ScoreRank.X;
    }

    if (ratio300 > 0.9 && ratio50 <= 0.01 && this.countMiss === 0) {
      return hasHD || hasFL ? ScoreRank.SH : ScoreRank.S;
    }

    if ((ratio300 > 0.8 && this.countMiss === 0) || ratio300 > 0.9) {
      return ScoreRank.A;
    }

    if ((ratio300 > 0.7 && this.countMiss === 0) || ratio300 > 0.8) {
      return ScoreRank.B;
    }

    return ratio300 > 0.6 ? ScoreRank.C : ScoreRank.D;
  }

  /**
   * osu!taiko score rank.
   */
  private get _taikoScoreRank(): ScoreRank {
    const hasFL = this.mods?.has('FL') ?? false;
    const hasHD = this.mods?.has('HD') ?? false;

    const ratio300 = Math.fround(this.count300 / this.totalHits);
    const ratio50 = Math.fround(this.count50 / this.totalHits);

    if (ratio300 === 1) {
      return hasHD || hasFL ? ScoreRank.XH : ScoreRank.X;
    }

    if (ratio300 > 0.9 && ratio50 <= 0.01 && this.countMiss === 0) {
      return hasHD || hasFL ? ScoreRank.SH : ScoreRank.S;
    }

    if ((ratio300 > 0.8 && this.countMiss === 0) || ratio300 > 0.9) {
      return ScoreRank.A;
    }

    if ((ratio300 > 0.7 && this.countMiss === 0) || ratio300 > 0.8) {
      return ScoreRank.B;
    }

    return ratio300 > 0.6 ? ScoreRank.C : ScoreRank.D;
  }

  /**
   * osu!catch score rank.
   */
  private get _catchScoreRank(): ScoreRank {
    const hasFL = this.mods?.has('FL') ?? false;
    const hasHD = this.mods?.has('HD') ?? false;
    const accuracy = this.accuracy;

    if (accuracy === 1) {
      return hasHD || hasFL ? ScoreRank.XH : ScoreRank.X;
    }

    if (accuracy > 0.98) {
      return hasHD || hasFL ? ScoreRank.SH : ScoreRank.S;
    }

    if (accuracy > 0.94) return ScoreRank.A;
    if (accuracy > 0.90) return ScoreRank.B;
    if (accuracy > 0.85) return ScoreRank.C;

    return ScoreRank.D;
  }

  /**
   * osu!mania score rank.
   */
  private get _maniaScoreRank(): ScoreRank {
    const hasFL = this.mods?.has('FL') ?? false;
    const hasHD = this.mods?.has('HD') ?? false;
    const accuracy = this.accuracy;

    if (accuracy === 1) {
      return hasHD || hasFL ? ScoreRank.XH : ScoreRank.X;
    }

    if (accuracy > 0.95) {
      return hasHD || hasFL ? ScoreRank.SH : ScoreRank.S;
    }

    if (accuracy > 0.9) return ScoreRank.A;
    if (accuracy > 0.8) return ScoreRank.B;
    if (accuracy > 0.7) return ScoreRank.C;

    return ScoreRank.D;
  }
}
