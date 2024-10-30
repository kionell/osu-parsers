import { BeatmapConverter } from '../../Beatmaps/BeatmapConverter';

import { IMod } from '../IMod';

/**
 * Mod that applicable to the converter.
 */
export interface IApplicableToConverter extends IMod {
  /**
   * Applies a mod to the specified converter.
   * @param converter A converter.
   */
  applyToConverter(converter: BeatmapConverter): void;
}
