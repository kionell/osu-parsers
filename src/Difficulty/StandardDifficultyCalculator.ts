import {
  DifficultyCalculator,
  DifficultyRange,
  HitResult,
  IBeatmap,
  IMod,
  ModBitwise,
  Skill,
} from 'osu-classes';

import {
  StandardDoubleTime,
  StandardEasy,
  StandardFlashlight,
  StandardHalfTime,
  StandardHardRock,
  StandardModCombination,
} from '../Mods';

import { Aim, Speed, Flashlight } from './Skills';
import { StandardDifficultyAttributes } from './Attributes';
import { StandardDifficultyHitObject } from './Preprocessing';
import { StandardHitWindows } from '../Scoring';
import { Circle, Slider, Spinner } from '../Objects';

export class StandardDifficultyCalculator extends DifficultyCalculator<StandardDifficultyAttributes> {
  private _DIFFICULTY_MULTIPLIER = 0.0675;
  private _hitWindowGreat = 0;

  protected _createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: StandardModCombination,
    skills: Skill[],
    clockRate: number,
  ): StandardDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new StandardDifficultyAttributes(mods, 0);
    }

    const aimRating = Math.sqrt(skills[0].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    const aimRatingNoSliders = Math.sqrt(skills[1].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    let speedRating = Math.sqrt(skills[2].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    const flashlightRating = Math.sqrt(skills[3].difficultyValue) * this._DIFFICULTY_MULTIPLIER;

    const sliderFactor = aimRating > 0 ? aimRatingNoSliders / aimRating : 1;

    if (mods.has(ModBitwise.Relax)) speedRating = 0;

    const baseAimPerformance = Math.pow(5 * Math.max(1, aimRating / 0.0675) - 4, 3) / 100000;
    const baseSpeedPerformance = Math.pow(5 * Math.max(1, speedRating / 0.0675) - 4, 3) / 100000;

    let baseFlashlightPerformance = 0;

    if (mods.has(ModBitwise.Flashlight)) {
      baseFlashlightPerformance = Math.pow(flashlightRating, 2) * 25;
    }

    const basePerformance = Math.pow(
      Math.pow(baseAimPerformance, 1.1) +
      Math.pow(baseSpeedPerformance, 1.1) +
      Math.pow(baseFlashlightPerformance, 1.1), 1 / 1.1,
    );

    let starRating = 0;

    if (basePerformance > 0.00001) {
      starRating = Math.cbrt(1.12) * 0.027
        * (Math.cbrt(100000 / Math.pow(2, 1 / 1.1) * basePerformance) + 4);
    }

    const approachRate = beatmap.difficulty.approachRate;

    const preempt = DifficultyRange.map(approachRate, 1800, 1200, 450) / clockRate;

    const circles = beatmap.hitObjects.filter((h) => h instanceof Circle);
    const sliders = beatmap.hitObjects.filter((h) => h instanceof Slider);
    const spinners = beatmap.hitObjects.filter((h) => h instanceof Spinner);

    const nested = sliders.reduce((sum, slider) => {
      return sum + (slider as Slider).nestedHitObjects.length;
    }, 0);

    const attributes = new StandardDifficultyAttributes(mods, starRating);

    attributes.aimStrain = aimRating;
    attributes.speedStrain = speedRating;
    attributes.flashlightRating = flashlightRating;
    attributes.sliderFactor = sliderFactor;
    attributes.hitCircleCount = circles.length;
    attributes.sliderCount = sliders.length;
    attributes.spinnerCount = spinners.length;
    attributes.maxCombo = circles.length + spinners.length + nested;
    attributes.drainRate = beatmap.difficulty.drainRate;
    attributes.overallDifficulty = (80 - this._hitWindowGreat) / 6;
    attributes.approachRate = preempt > 1200
      ? (1800 - preempt) / 120
      : (1200 - preempt) / 150 + 5;

    return attributes;
  }

  protected *_createDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): Generator<StandardDifficultyHitObject> {
    /**
     * The first jump is formed by the first two hitobjects of the map.
     * If the map has less than two hit objects, the enumerator will not return anything.
     */
    for (let i = 1; i < beatmap.hitObjects.length; ++i) {
      const lastLast = i > 1 ? beatmap.hitObjects[i - 2] : null;
      const last = beatmap.hitObjects[i - 1];
      const current = beatmap.hitObjects[i];

      yield new StandardDifficultyHitObject(current, lastLast, last, clockRate);
    }
  }

  protected _createSkills(beatmap: IBeatmap, mods: StandardModCombination, clockRate: number): Skill[] {
    const hitWindows = new StandardHitWindows();

    hitWindows.setDifficulty(beatmap.difficulty.overallDifficulty);

    this._hitWindowGreat = hitWindows.windowFor(HitResult.Great) / clockRate;

    return [
      new Aim(mods, true),
      new Aim(mods, false),
      new Speed(mods, this._hitWindowGreat),
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
