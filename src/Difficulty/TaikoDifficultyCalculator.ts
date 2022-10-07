import { DifficultyCalculator, DifficultyHitObject, HitResult, IBeatmap, IMod, Skill } from 'osu-classes';
import { TaikoDifficultyAttributes } from './Attributes';
import { Peaks } from './Skills/Peaks';
import { TaikoHitWindows } from '../Scoring';
import { TaikoBeatmap } from '../Beatmaps';

import {
  TaikoColourDifficultyPreprocessor,
  TaikoDifficultyHitObject,
} from './Preprocessing';

import {
  TaikoDoubleTime,
  TaikoEasy,
  TaikoHalfTime,
  TaikoHardRock,
  TaikoModCombination,
} from '../Mods';

/**
 * A taiko difficulty calculator.
 */
export class TaikoDifficultyCalculator extends DifficultyCalculator<TaikoDifficultyAttributes> {
  private static readonly DIFFICULTY_MULTIPLIER = 1.35;

  protected _createSkills(_: IBeatmap, mods: TaikoModCombination): Skill[] {
    return [
      new Peaks(mods),
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

  protected _createDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): DifficultyHitObject[] {
    const difficultyObjects: DifficultyHitObject[] = [];
    const centreObjects: TaikoDifficultyHitObject[] = [];
    const rimObjects: TaikoDifficultyHitObject[] = [];
    const noteObjects: TaikoDifficultyHitObject[] = [];

    for (let i = 2; i < beatmap.hitObjects.length; ++i) {
      const hitObject = beatmap.hitObjects[i];
      const lastObject = beatmap.hitObjects[i - 1];
      const lastLastObject = beatmap.hitObjects[i - 2];

      const difficultyObject = new TaikoDifficultyHitObject(
        hitObject,
        lastObject,
        lastLastObject,
        clockRate,
        difficultyObjects,
        centreObjects,
        rimObjects,
        noteObjects,
        difficultyObjects.length,
      );

      difficultyObjects.push(difficultyObject);
    }

    TaikoColourDifficultyPreprocessor.processAndAssign(difficultyObjects);

    return difficultyObjects;
  }

  protected _createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: TaikoModCombination,
    skills: Skill[],
    clockRate: number,
  ): TaikoDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new TaikoDifficultyAttributes(mods, 0);
    }

    const combined = skills[0] as Peaks;
    const multiplier = TaikoDifficultyCalculator.DIFFICULTY_MULTIPLIER;

    const colourRating = combined.colourDifficultyValue * multiplier;
    const rhythmRating = combined.rhythmDifficultyValue * multiplier;
    const staminaRating = combined.staminaDifficultyValue * multiplier;

    const combinedRating = combined.difficultyValue * multiplier;

    let starRating = this._rescale(combinedRating * 1.4);

    /**
     * TODO: This is temporary measure as we don't detect abuse 
     * of multiple-input playstyles of converts within the current system.
     */
    if (beatmap.originalMode === 0) {
      starRating *= 0.925;

      /**
       * For maps with low colour variance and high stamina requirement, 
       * multiple inputs are more likely to be abused.
       */
      if (colourRating < 2 && staminaRating > 8) {
        starRating *= 0.8;
      }
    }

    const hitWindows = new TaikoHitWindows();

    hitWindows.setDifficulty(beatmap.difficulty.overallDifficulty);

    const attributes = new TaikoDifficultyAttributes(mods, starRating);

    attributes.staminaDifficulty = staminaRating;
    attributes.rhythmDifficulty = rhythmRating;
    attributes.colourDifficulty = colourRating;
    attributes.peakDifficulty = combinedRating;
    attributes.greatHitWindow = hitWindows.windowFor(HitResult.Great) / clockRate,
    attributes.maxCombo = (beatmap as TaikoBeatmap)?.maxCombo ?? 0;

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
   * Applies a final re-scaling of the star rating.
   * @param sr The raw star rating value before re-scaling.
   */
  private _rescale(sr: number): number {
    if (sr < 0) return sr;

    return 10.43 * Math.log(sr / 8 + 1);
  }
}
