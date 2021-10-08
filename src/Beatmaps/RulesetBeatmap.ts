import { Beatmap } from './Beatmap';
import { ModCombination } from '../Mods/ModCombination';

/**
 * A ruleset beatmap.
 */
export abstract class RulesetBeatmap extends Beatmap {
  /**
   * Beatmap max possible combo.
   */
  abstract get maxCombo(): number;

  /**
   * Applied mods of a beatmap.
   */
  abstract mods: ModCombination;

  /**
   * Creates a new mod combination by bitwise and applies it to the beatmap.
   * @param bitwise Mod bitwise.
   * @returns The same beatmap with applied mods.
   */
  abstract applyMods(bitwise: number): this;

  /**
   * Resets a mod combination from the beatmap.
   */
  abstract resetMods(): this;
}
