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
}
