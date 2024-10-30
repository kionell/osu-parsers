/**
 * A hit object that is part of a combo.
 */
export interface IHasCombo {
  /**
   * Whether the hit object starts a new combo.
   */
  isNewCombo: boolean;

  /**
   * When starting a new combo, the offset of the new combo relative to the current one.
   */
  comboOffset: number;
}
