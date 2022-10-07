import {
  DifficultyCalculator,
  DifficultyRange,
  HitResult,
  IBeatmap,
  IMod,
  Skill,
} from 'osu-classes';

import {
  StandardDoubleTime,
  StandardEasy,
  StandardFlashlight,
  StandardHalfTime,
  StandardHardRock,
  StandardModCombination,
  StandardRelax,
  StandardTouchDevice,
} from '../Mods';

import { Aim, Speed, Flashlight } from './Skills';
import { StandardDifficultyAttributes } from './Attributes';
import { StandardDifficultyHitObject } from './Preprocessing';
import { Circle, Slider, Spinner } from '../Objects';
import { StandardHitWindows } from '../Scoring';
import { StandardPerformanceCalculator } from './StandardPerformanceCalculator';

export class StandardDifficultyCalculator extends DifficultyCalculator<StandardDifficultyAttributes> {
  private _DIFFICULTY_MULTIPLIER = 0.0675;

  protected _createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: StandardModCombination,
    skills: Skill[],
    clockRate: number,
  ): StandardDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new StandardDifficultyAttributes(mods, 0);
    }

    let aimRating = Math.sqrt(skills[0].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    let speedRating = Math.sqrt(skills[2].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    let flashlightRating = Math.sqrt(skills[3].difficultyValue) * this._DIFFICULTY_MULTIPLIER;

    const aimRatingNoSliders = Math.sqrt(skills[1].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    const speedNoteCount = (skills[2] as Speed).relevantNoteCount();

    const sliderFactor = aimRating > 0 ? aimRatingNoSliders / aimRating : 1;

    if (mods.any(StandardTouchDevice)) {
      aimRating = Math.pow(aimRating, 0.8);
      flashlightRating = Math.pow(flashlightRating, 0.8);
    }

    if (mods.any(StandardRelax)) {
      aimRating *= 0.9;
      speedRating = 0;
      flashlightRating *= 0.7;
    }

    const baseAimPerformance = Math.pow(5 * Math.max(1, aimRating / 0.0675) - 4, 3) / 100000;
    const baseSpeedPerformance = Math.pow(5 * Math.max(1, speedRating / 0.0675) - 4, 3) / 100000;

    let baseFlashlightPerformance = 0;

    if (mods.any(StandardFlashlight)) {
      baseFlashlightPerformance = Math.pow(flashlightRating, 2) * 25;
    }

    const basePerformance = Math.pow(
      Math.pow(baseAimPerformance, 1.1) +
      Math.pow(baseSpeedPerformance, 1.1) +
      Math.pow(baseFlashlightPerformance, 1.1), 1 / 1.1,
    );

    const baseMultiplier = StandardPerformanceCalculator.PERFORMANCE_BASE_MULTIPLIER;

    const starRating = basePerformance > 0.00001
      ? Math.cbrt(baseMultiplier) * 0.027 * (Math.cbrt(100000 / Math.pow(2, 1 / 1.1) * basePerformance) + 4)
      : 0;

    const approachRate = beatmap.difficulty.approachRate;

    const preempt = DifficultyRange.map(approachRate, 1800, 1200, 450) / clockRate;

    const circles = beatmap.hitObjects.filter((h) => h instanceof Circle) as Circle[];
    const sliders = beatmap.hitObjects.filter((h) => h instanceof Slider) as Slider[];
    const spinners = beatmap.hitObjects.filter((h) => h instanceof Spinner) as Spinner[];

    const nested = sliders.reduce((sum, slider) => sum + slider.nestedHitObjects.length, 0);

    const hitWindows = new StandardHitWindows();

    hitWindows.setDifficulty(beatmap.difficulty.overallDifficulty);

    const hitWindowGreat = hitWindows.windowFor(HitResult.Great) / clockRate;

    const attributes = new StandardDifficultyAttributes(mods, starRating);

    attributes.aimDifficulty = aimRating;
    attributes.speedDifficulty = speedRating;
    attributes.speedNoteCount = speedNoteCount;
    attributes.flashlightDifficulty = flashlightRating;
    attributes.sliderFactor = sliderFactor;
    attributes.hitCircleCount = circles.length;
    attributes.sliderCount = sliders.length;
    attributes.spinnerCount = spinners.length;
    attributes.maxCombo = circles.length + spinners.length + nested;
    attributes.drainRate = beatmap.difficulty.drainRate;
    attributes.overallDifficulty = (80 - hitWindowGreat) / 6;
    attributes.approachRate = preempt > 1200
      ? (1800 - preempt) / 120
      : (1200 - preempt) / 150 + 5;

    return attributes;
  }

  protected _createDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): StandardDifficultyHitObject[] {
    const difficultyObjects = new Array(beatmap.hitObjects.length);

    /**
     * The first jump is formed by the first two hitobjects of the map.
     * If the map has less than two hit objects, the enumerator will not return anything.
     */
    for (let i = 1; i < beatmap.hitObjects.length; ++i) {
      const lastLast = i > 1 ? beatmap.hitObjects[i - 2] : null;
      const last = beatmap.hitObjects[i - 1];
      const current = beatmap.hitObjects[i];

      difficultyObjects[i - 1] = new StandardDifficultyHitObject(
        current,
        last,
        lastLast,
        clockRate,
        difficultyObjects,
        difficultyObjects.length,
      );
    }

    return difficultyObjects;
  }

  protected _createSkills(_: IBeatmap, mods: StandardModCombination): Skill[] {
    return [
      new Aim(mods, true),
      new Aim(mods, false),
      new Speed(mods),
      new Flashlight(mods),
    ];
  }

  get difficultyMods(): IMod[] {
    return [
      new StandardDoubleTime(),
      new StandardHalfTime(),
      new StandardEasy(),
      new StandardHardRock(),
      new StandardFlashlight(),
    ];
  }
}
