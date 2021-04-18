import { IHitObject } from '../../Objects/IHitObject';

import { IMod } from '../IMod';

/**
 * Mod that applicable to the hit objects.
 */
export interface IApplicableToHitObjects extends IMod {
  /**
   * Applies a mod to beatmap hit objects.
   * @param hitObjects Beatmap hit objects.
   */
  applyToHitObjects(hitObjects: IHitObject[]): void;
}
