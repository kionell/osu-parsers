import {
  DifficultyCalculator,
  HitResult,
  IBeatmap,
  IMod,
  ModCombination,
  Skill,
} from 'osu-resources';

import {
  TaikoDoubleTime,
  TaikoEasy,
  TaikoHalfTime,
  TaikoHardRock,
} from '../Mods';

import {
  Colour,
  Rhythm,
  Stamina,
} from './Skills';

import {
  TaikoDifficultyHitObject,
  StaminaCheeseDetector,
} from './Preprocessing';

import { TaikoDifficultyAttributes } from './Attributes';
import { TaikoBeatmap } from '../Beatmaps';
import { TaikoHitWindows } from '../Scoring';

/**
 * A taiko difficulty calculator.
 */
export class TaikoDifficultyCalculator extends DifficultyCalculator {
  private static _COLOUR_SKILL_MULTIPLIER = 0.01;
  private static _RHYTHM_SKILL_MULTIPLIER = 0.014;
  private static _STAMINA_SKILL_MULTIPLIER = 0.02;

  protected _createSkills(beatmap: IBeatmap, mods: ModCombination): Skill[] {
    return [
      new Colour(mods),
      new Rhythm(mods),
      new Stamina(mods, true),
      new Stamina(mods, false),
    ];
  }

  get difficultyMods(): IMod[] {
    return [
      new TaikoDoubleTime(),
      new TaikoHalfTime(),
      new TaikoEasy(),
      new TaikoHardRock(),
    ];
  }

  protected *_createDifficultyHitObjects(beatmap: IBeatmap): Generator<TaikoDifficultyHitObject> {
    const difficultyObjects: TaikoDifficultyHitObject[] = [];
    const clockRate = beatmap.difficulty.clockRate;

    for (let i = 2; i < beatmap.hitObjects.length; ++i) {
      const hitObject = beatmap.hitObjects[i];
      const lastObject = beatmap.hitObjects[i - 1];
      const lastLastObject = beatmap.hitObjects[i - 2];

      const difficultyObject = new TaikoDifficultyHitObject(
        hitObject,
        lastObject,
        lastLastObject,
        clockRate,
        i,
      );

      difficultyObjects.push(difficultyObject);
    }

    new StaminaCheeseDetector(difficultyObjects).findCheese();

    for (const difficultyObject of difficultyObjects) {
      yield difficultyObject;
    }
  }

  protected _createDifficultyAttributes(beatmap: IBeatmap, mods: ModCombination, skills: Skill[]): TaikoDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new TaikoDifficultyAttributes(mods, 0);
    }

    const clockRate = beatmap.difficulty.clockRate;

    const colour = skills[0] as Colour;
    const rhythm = skills[1] as Rhythm;
    const staminaRight = skills[2] as Stamina;
    const staminaLeft = skills[3] as Stamina;

    const colourMultiplier = TaikoDifficultyCalculator._COLOUR_SKILL_MULTIPLIER;
    const rhythmMultiplier = TaikoDifficultyCalculator._RHYTHM_SKILL_MULTIPLIER;
    const staminaMultiplier = TaikoDifficultyCalculator._STAMINA_SKILL_MULTIPLIER;

    const colourRating = colour.difficultyValue * colourMultiplier;
    const rhythmRating = rhythm.difficultyValue * rhythmMultiplier;
    let staminaRating = (staminaRight.difficultyValue + staminaLeft.difficultyValue) * staminaMultiplier;

    const staminaPenalty = TaikoDifficultyCalculator._simpleColourPenalty(staminaRating, colourRating);

    staminaRating *= staminaPenalty;

    const combinedRating = this._locallyCombinedDifficulty(colour, rhythm, staminaRight, staminaLeft, staminaPenalty);
    const separatedRating = TaikoDifficultyCalculator._norm(1.5, [colourRating, rhythmRating, staminaRating]);
    let starRating = 1.4 * separatedRating + 0.5 * combinedRating;

    starRating = TaikoDifficultyCalculator._rescale(starRating);

    const hitWindows = new TaikoHitWindows();

    hitWindows.setDifficulty(beatmap.difficulty.overallDifficulty);

    const attributes = new TaikoDifficultyAttributes(mods, starRating);

    attributes.staminaStrain = staminaRating;
    attributes.rhythmStrain = rhythmRating;
    attributes.colourStrain = colourRating;
    attributes.greatHitWindow = hitWindows.windowFor(HitResult.Great) / clockRate;
    attributes.maxCombo = (beatmap as TaikoBeatmap).maxCombo;

    return attributes;
  }

  /**
   * Calculates the penalty for the stamina skill for maps with low colour difficulty.
   * Some maps (especially converts) can be easy to read despite a high note density.
   * This penalty aims to reduce the star rating of such maps 
   * by factoring in colour difficulty to the stamina skill.
   */
  private static _simpleColourPenalty(staminaDifficulty: number, colorDifficulty: number) {
    if (colorDifficulty <= 0) return 0.79 - 0.25;

    return 0.79 - Math.atan(staminaDifficulty / colorDifficulty - 12) / Math.PI / 2;
  }

  /**
   * Returns the p-norm of an n-dimensional vector.
   * @param p The value to calculate the norm for.
   * @param values The coefficients of the vector.
   */
  private static _norm(p: number, values: number[]) {
    const map = values.map((x) => Math.pow(x, p));
    const reduce = map.reduce((p, c) => p + c, 0);

    return Math.pow(reduce, 1 / p);
  }

  /**
   * Returns the partial star rating of the beatmap, 
   * calculated using peak strains from all sections of the map.
   * For each section, the peak strains of all separate skills 
   * are combined into a single peak strain for the section.
   * The resulting partial rating of the beatmap is a weighted sum 
   * of the combined peaks (higher peaks are weighted more).
   */
  private _locallyCombinedDifficulty(
    colour: Colour,
    rhythm: Rhythm,
    staminaRight: Stamina,
    staminaLeft: Stamina,
    staminaPenalty: number,
  ) {
    const peaks: number[] = [];

    const colourPeaks = [...colour.getCurrentStrainPeaks()];
    const rhythmPeaks = [...rhythm.getCurrentStrainPeaks()];
    const staminaRightPeaks = [...staminaRight.getCurrentStrainPeaks()];
    const staminaLeftPeaks = [...staminaLeft.getCurrentStrainPeaks()];

    const colourMultiplier = TaikoDifficultyCalculator._COLOUR_SKILL_MULTIPLIER;
    const rhythmMultiplier = TaikoDifficultyCalculator._RHYTHM_SKILL_MULTIPLIER;
    const staminaMultiplier = TaikoDifficultyCalculator._STAMINA_SKILL_MULTIPLIER * staminaPenalty;

    for (let i = 0; i < colourPeaks.length; ++i) {
      const colourPeak = colourPeaks[i] * colourMultiplier;
      const rhythmPeak = rhythmPeaks[i] * rhythmMultiplier;
      const staminaPeak = (staminaRightPeaks[i] + staminaLeftPeaks[i]) * staminaMultiplier;

      const values = [colourPeak, rhythmPeak, staminaPeak];

      peaks.push(TaikoDifficultyCalculator._norm(2, values));
    }

    let difficulty = 0;
    let weight = 1;

    for (const strain of peaks.sort((a, b) => b - a)) {
      difficulty += strain * weight;
      weight *= 0.9;
    }

    return difficulty;
  }

  /**
   * Applies a final re-scaling of the star rating to bring maps with recorded full combos below 9.5 stars.
   * @param sr The raw star rating value before re-scaling.
   */
  private static _rescale(sr: number) {
    if (sr < 0) return sr;

    return 10.43 * Math.log(sr / 8 + 1);
  }
}
