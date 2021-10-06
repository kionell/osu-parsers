import { Beatmap } from './Beatmap';
import { IRuleset } from '../Rulesets/IRuleset';
import { ModCombination } from '../Mods/ModCombination';

/**
 * A ruleset beatmap.
 */
export abstract class RulesetBeatmap extends Beatmap {
  /**
   * Beatmap ruleset.
   */
  abstract ruleset: IRuleset;

  /**
   * Beatmap mods.
   */
  abstract mods: ModCombination;

  /**
   * Creates a new mod combination by bitwise and applies it to the beatmap.
   * @param bitwise Mod bitwise.
   * @returns The same beatmap with applied mods.
   */
  abstract applyMods(bitwise: number): Beatmap;

  /**
   * Resets a mod combination from the beatmap.
   */
  abstract resetMods(): Beatmap;

  /**
   * Beatmap game mode.
   */
  get mode(): number {
    return this.ruleset.id || this.base.mode;
  }
}
