import { IHasCombo } from './IHasCombo';

/**
 * A hit object that is part of a combo and has extended information 
 * about its position relative to other combo objects.
 */
export interface IHasComboInformation extends IHasCombo {
  /**
   * The index of this hit object in the current combo.
   */
  currentComboIndex: number;

  /**
   * The index of this combo in relation to the beatmap.
   */
  comboIndex: number;

  /**
   * The index of this combo in relation to the beatmap, with applied combo offset.
   * This should be used instead of original combo index 
   * only when retrieving combo colours from the beatmap's skin.
   */
  comboIndexWithOffsets: number;

  /**
   * Whether this is the last object in the current combo.
   */
  lastInCombo: boolean;
}
