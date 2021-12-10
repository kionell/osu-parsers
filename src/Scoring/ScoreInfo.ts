import { Beatmap, IBeatmap } from '../Beatmaps';
import { IRuleset } from '../Rulesets';
import { ModCombination } from '../Mods';
import { ScoreRank } from './Enums/ScoreRank';

export class ScoreInfo {
  id = 0;
  rank: ScoreRank = ScoreRank.F;
  totalScore = 0;
  accuracy = 0;
  pp?: number;
  maxCombo = 0;
  rulesetID = 0;
  passed = true;
  ruleset?: IRuleset;
  mods?: ModCombination;
  username = '';
  userID = 0;
  beatmap: IBeatmap = new Beatmap();
  date: Date = new Date();

  statistics = {
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

  hash = '';

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
