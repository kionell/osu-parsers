import {
  DifficultyCalculator,
  DifficultyRange,
  HitResult,
  IBeatmap,
  IMod,
  ModBitwise,
  Skill,
} from 'osu-classes';

import { StandardBeatmap } from '../Beatmaps';
import { StandardHitWindows } from '../Scoring';

import {
  StandardDoubleTime,
  StandardEasy,
  StandardFlashlight,
  StandardHalfTime,
  StandardHardRock,
  StandardModCombination,
} from '../Mods';

import { Aim, Speed, Flashlight } from './Skills';
import { StandardDifficultyAttributes } from './Attributes/StandardDifficultyAttributes';
import { StandardDifficultyHitObject } from './Preprocessing/StandardDifficultyHitObject';

export class StandardDifficultyCalculator extends DifficultyCalculator {
  private _DIFFICULTY_MULTIPLIER = 0.0675;
  private _hitWindowGreat = 0;

  protected _createDifficultyAttributes(beatmap: IBeatmap, mods: StandardModCombination, skills: Skill[]): StandardDifficultyAttributes {
    if (beatmap.hitObjects.length === 0) {
      return new StandardDifficultyAttributes(mods, 0);
    }

    const aimRating = Math.sqrt(skills[0].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    const aimRatingNoSliders = Math.sqrt(skills[1].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    let speedRating = Math.sqrt(skills[2].difficultyValue) * this._DIFFICULTY_MULTIPLIER;
    const flashlightRating = Math.sqrt(skills[3].difficultyValue) * this._DIFFICULTY_MULTIPLIER;

    const sliderFactor = aimRating > 0 ? aimRatingNoSliders / aimRating : 1;

    if (mods.has(ModBitwise.Relax)) {
      speedRating = 0.0;
    }

    const baseAimPerformance = Math.pow(5 * Math.max(1, aimRating / 0.0675) - 4, 3) / 100000;
    const baseSpeedPerformance = Math.pow(5 * Math.max(1, speedRating / 0.0675) - 4, 3) / 100000;
    let baseFlashlightPerformance = 0.0;

    if (mods.has(ModBitwise.Flashlight)) {
      baseFlashlightPerformance = Math.pow(flashlightRating, 2.0) * 25.0;
    }

    const basePerformance = Math.pow(
      Math.pow(baseAimPerformance, 1.1) +
      Math.pow(baseSpeedPerformance, 1.1) +
      Math.pow(baseFlashlightPerformance, 1.1), 1.0 / 1.1,
    );

    let starRating = 0;

    if (basePerformance > 0.00001) {
      starRating = Math.cbrt(1.12) * 0.027
        * (Math.cbrt(100000 / Math.pow(2, 1 / 1.1) * basePerformance) + 4);
    }

    const standardBeatmap = beatmap as StandardBeatmap;

    const approachRate = standardBeatmap.difficulty.approachRate;
    const drainRate = standardBeatmap.difficulty.drainRate;
    const clockRate = standardBeatmap.difficulty.clockRate;

    const preempt = DifficultyRange.map(approachRate, 1800, 1200, 450) / clockRate;
    const maxCombo = standardBeatmap.maxCombo;

    const hitCirclesCount = standardBeatmap.circles;
    const sliderCount = standardBeatmap.sliders;
    const spinnerCount = standardBeatmap.spinners;

    const attributes = new StandardDifficultyAttributes(mods, starRating);

    attributes.aimStrain = aimRating;
    attributes.speedStrain = speedRating;
    attributes.flashlightRating = flashlightRating;
    attributes.sliderFactor = sliderFactor;
    attributes.approachRate = preempt > 1200 ? (1800 - preempt) / 120 : (1200 - preempt) / 150 + 5;
    attributes.overallDifficulty = (80 - this._hitWindowGreat) / 6;
    attributes.drainRate = drainRate;
    attributes.maxCombo = maxCombo;
    attributes.hitCircleCount = hitCirclesCount;
    attributes.sliderCount = sliderCount;
    attributes.spinnerCount = spinnerCount;

    return attributes;
  }

  protected *_createDifficultyHitObjects(beatmap: IBeatmap): Generator<StandardDifficultyHitObject> {
    /**
     * The first jump is formed by the first two hitobjects of the map.
     * If the map has less than two hit objects, the enumerator will not return anything.
     */
    for (let i = 1; i < beatmap.hitObjects.length; ++i) {
      const lastLast = i > 1 ? beatmap.hitObjects[i - 2] : null;
      const last = beatmap.hitObjects[i - 1];
      const current = beatmap.hitObjects[i];
      const clockRate = beatmap.difficulty.clockRate;

      yield new StandardDifficultyHitObject(current, lastLast, last, clockRate);
    }
  }

  protected _createSkills(beatmap: IBeatmap, mods: StandardModCombination): Skill[] {
    const clockRate = beatmap.difficulty.clockRate;
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
