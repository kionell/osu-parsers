import { Beatmap } from './Beatmap';
import { ModCombination } from '../Mods';

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
   * Creates a deep copy of this ruleset beatmap.
   * @returns Cloned ruleset beatmap.
   */
  clone(): this {
    const cloned = super.clone();

    cloned.mods = this.mods.clone();

    return cloned;
  }
}
