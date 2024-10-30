import { ModCombination } from '../../Mods/ModCombination';

/**
 * Describes the difficulty of a beatmap, as output by a difficulty calculator.
 */
export abstract class DifficultyAttributes {
  /**
   * The mods which were applied to the beatmap.
   */
  mods: ModCombination;

  /**
   * The combined star rating of all skill.
   */
  starRating: number;

  /**
   * The maximum achievable combo.
   */
  maxCombo = 0;

  /**
   * Creates new difficulty attributes.
   * @param mods The mods which were applied to the beatmap.
   * @param starRating The combined star rating of all skills.
   */
  constructor(mods: ModCombination, starRating: number) {
    this.mods = mods;
    this.starRating = starRating;
  }
}
