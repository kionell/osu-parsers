import { ModCombination } from '../../Mods/ModCombination';

/**
 * Describes the difficulty of a beatmap, as output by a difficulty calculator.
 */
export abstract class DifficultyAttributes {
  static ATTRIB_ID_AIM = 1;
  static ATTRIB_ID_SPEED = 3;
  static ATTRIB_ID_OVERALL_DIFFICULTY = 5;
  static ATTRIB_ID_APPROACH_RATE = 7;
  static ATTRIB_ID_MAX_COMBO = 9;
  static ATTRIB_ID_STRAIN = 11;
  static ATTRIB_ID_GREAT_HIT_WINDOW = 13;
  static ATTRIB_ID_SCORE_MULTIPLIER = 15;
  static ATTRIB_ID_FLASHLIGHT = 17;
  static ATTRIB_ID_SLIDER_FACTOR = 19;

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

  /**
   * Converts this difficulty attributes to osu-web compatible database attribute mappings.
   */
  abstract toDatabaseAttributes(): Generator<[number, number]>;

  /**
   * Reads osu-web database attribute mappings into this difficulty attributes object.
   * @param values The attribute mappings.
   */
  abstract fromDatabaseAttributes(values: {[key: number]: number}): void;
}
