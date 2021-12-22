import {
  HitObject,
  ModCombination,
  Beatmap,
  RulesetBeatmap,
} from 'osu-classes';
import { StandardDifficultyAttributes } from '../src/Difficulty';

import { StandardHardRock } from '../src/Mods';

interface IComparableDifficulty {
  CS: number;
  AR: number;
  HP: number;
  OD: number;
}

export interface IStarRatings {
  [key: string]: number;
}

export interface IPerformances {
  [key: string]: number;
}

export function matchBeatmapWithMods(original: Beatmap, beatmap: RulesetBeatmap, mods?: ModCombination): void {
  const { CS, AR, HP, OD } = getDifficulty(original, mods);

  if (mods) {
    expect(beatmap.mods.bitwise).toEqual(mods.bitwise);
  }

  expect(beatmap.difficulty.circleSize).toBeCloseTo(CS);
  expect(beatmap.difficulty.approachRate).toBeCloseTo(AR);
  expect(beatmap.difficulty.drainRate).toBeCloseTo(HP);
  expect(beatmap.difficulty.overallDifficulty).toBeCloseTo(OD);

  /* Check hit objects */
  for (let i = 0; i < beatmap.hitObjects.length; ++i) {
    matchHitObjects(original.hitObjects[i], beatmap.hitObjects[i], mods);
  }
}

export function matchHitObjects(original: HitObject, hitObject: HitObject, mods?: ModCombination): void {
  const isFlipped = !!mods?.has('HR');

  const originalY = original.startPosition.y;
  const flippedY = StandardHardRock.BASE_SIZE.y - originalY;

  const actualY = hitObject.startPosition.y;
  const expectedY = isFlipped ? flippedY : originalY;

  expect(actualY).toBeCloseTo(expectedY);

  const hitObjectNested = hitObject.nestedHitObjects;
  const originalNested = original.nestedHitObjects;

  if (hitObjectNested.length !== originalNested.length) return;

  for (let j = 0; j < hitObjectNested.length; ++j) {
    const originalNestedY = originalNested[j]?.startPosition?.y;
    const flippedNestedY = StandardHardRock.BASE_SIZE.y - originalNestedY;

    const actualNestedY = hitObjectNested[j]?.startPosition?.y;
    const expectedNestedY = isFlipped ? flippedNestedY : originalNestedY;

    expect(actualNestedY).toBeCloseTo(expectedNestedY);
  }
}

export function matchStars(attributes: StandardDifficultyAttributes, stars: IStarRatings): void {
  expect(attributes.starRating).toBeCloseTo(stars[attributes.mods.toString()]);
}

export function matchPerformance(totalPP: number, mods: ModCombination, performances: IPerformances): void {
  expect(totalPP).toBeCloseTo(performances[mods.toString()], 1);
}

export function getDifficulty(original: Beatmap, mods?: ModCombination): IComparableDifficulty {
  let CS = original.difficulty.circleSize;
  let AR = original.difficulty.approachRate;
  let HP = original.difficulty.drainRate;
  let OD = original.difficulty.overallDifficulty;

  if (mods?.has('EZ')) {
    CS /= 2;
    AR /= 2;
    HP /= 2;
    OD /= 2;
  }

  if (mods?.has('HR')) {
    CS = Math.min(CS * 1.3, 10);
    AR = Math.min(AR * 1.4, 10);
    HP = Math.min(HP * 1.4, 10);
    OD = Math.min(OD * 1.4, 10);
  }

  return { CS, AR, HP, OD };
}
