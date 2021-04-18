import { ModBitwise } from './Enums/ModBitwise';
import { ModType } from './Enums/ModType';

export interface IMod {
  /**
   * The name of this mod.
   */
  name: string;

  /**
   * The shortened name of this mod.
   */
  acronym: string;

  /**
   * Bitwise number of this mod.
   */
  bitwise: ModBitwise;

  /**
   * The type of this mod.
   */
  type: ModType;

  /**
   * The score multiplier of this mod.
   */
  multiplier: number;

  /**
   * Returns if this mod is ranked.
   */
  isRanked: boolean;

  /**
   * Incompatible mods.
   */
  incompatibles: ModBitwise;
}
