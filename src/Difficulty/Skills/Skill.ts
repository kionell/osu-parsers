import { ModCombination } from '../..';
import { DifficultyHitObject } from '../Preprocessing/DifficultyHitObject';

/**
 * A bare minimal abstract skill for fully custom skill implementations.
 * This class should be considered a "processing" class and not persisted.
 */
export abstract class Skill {
  /**
   * Mods for use in skill calculations.
   */
  protected _mods: ModCombination;

  constructor(mods: ModCombination) {
    this._mods = mods;
  }

  /**
   * Process a {@link DifficultyHitObject}.
   * @param current The difficulty hit object to process.
   */
  abstract process(current: DifficultyHitObject): void;

  /**
   * Returns the calculated difficulty value representing 
   * all difficulty hit objects that have been processed up to this point.
   */
  abstract get difficultyValue(): number;
}
