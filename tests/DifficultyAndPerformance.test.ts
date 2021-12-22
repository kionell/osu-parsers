import { ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';

import {
  StandardRuleset,
  StandardDifficultyAttributes,
  StandardBeatmap,
} from '../src';

import {
  IStarRatings,
  IPerformances,
  matchStars,
  matchPerformance,
} from './Utils';

import stars1 from './Standard/Difficulties/91.json';
import stars2 from './Standard/Difficulties/207659.json';
import stars3 from './Standard/Difficulties/1605148.json';
import stars4 from './Standard/Difficulties/2570401.json';

import performances1 from './Standard/Performances/91.json';
import performances2 from './Standard/Performances/207659.json';
import performances3 from './Standard/Performances/1605148.json';
import performances4 from './Standard/Performances/2570401.json';

const decoder = new BeatmapDecoder();
const ruleset = new StandardRuleset();

/**
 * One of the oldest maps in the game, which was published in 2007.
 * Uses v7 format and does not contain most of the properties.
 */
describe('Ni-Ni - 1,2,3,4, 007 [Wipeout Series] (MCXD) [-Breezin-]', () => {
  const decoded = decoder.decodeFromPath('./tests/Standard/Beatmaps/91.osu');
  const beatmap = ruleset.applyToBeatmap(decoded);
  const attributes = getAttributes(beatmap);

  test('Match star ratings', () => matchDifficulties(attributes, stars1));
  test('Match performaces', () => matchPerformances(beatmap, attributes, performances1));
});

/**
 * Average 4* map with stacked objects at the beggining.
 */
describe('MuryokuP - Catastrophe (meiikyuu) [Cataclysm]', () => {
  const decoded = decoder.decodeFromPath('./tests/Standard/Beatmaps/207659.osu');
  const beatmap = ruleset.applyToBeatmap(decoded);
  const attributes = getAttributes(beatmap);

  test('Match star ratings', () => matchDifficulties(attributes, stars2));
  test('Match performaces', () => matchPerformances(beatmap, attributes, performances2));
});

/**
 * 2B map with broken sliders. This map contains objects 
 * that can start earlier than the end of the previous one.
 * Mania converted map is not playable.
 */
describe('TheFatRat - Mayday (feat. Laura Brehm) (Voltaeyx) [[2B] Calling Out Mayday]', () => {
  const decoded = decoder.decodeFromPath('./tests/Standard/Beatmaps/1605148.osu');
  const beatmap = ruleset.applyToBeatmap(decoded);
  const attributes = getAttributes(beatmap);

  test('Match star ratings', () => matchDifficulties(attributes, stars3));
  test('Match performaces', () => matchPerformances(beatmap, attributes, performances3));
});

/**
 * Super long beatmap with 15k objects and 75 min length.
 * This takes some time to calculate all difficulty attributes.
 */
describe('Various Artists - Kagerou Project Compilation (Nevo) [Kagerou]', () => {
  const decoded = decoder.decodeFromPath('./tests/Standard/Beatmaps/2570401.osu');
  const beatmap = ruleset.applyToBeatmap(decoded);
  const attributes = getAttributes(beatmap);

  test('Match star ratings', () => matchDifficulties(attributes, stars4));
  test('Match performaces', () => matchPerformances(beatmap, attributes, performances4));
});

function getAttributes(beatmap: StandardBeatmap): StandardDifficultyAttributes[] {
  const difficultyCalculator = ruleset.createDifficultyCalculator(beatmap);

  return [...difficultyCalculator.calculateAll()];
}

function matchDifficulties(attributes: StandardDifficultyAttributes[], stars: IStarRatings) {
  attributes.forEach((atts) => matchStars(atts, stars));
}

function matchPerformances(beatmap: StandardBeatmap, attributes: StandardDifficultyAttributes[], performances: IPerformances) {
  attributes.forEach((atts) => {
    const score = new ScoreInfo({
      mods: atts.mods,
      maxCombo: beatmap.maxCombo,
      statistics: {
        great: beatmap.hitObjects.length,
      },
      accuracy: 1,
      beatmap,
    });

    const performanceCalculator = ruleset.createPerformanceCalculator(atts, score);
    const totalPerformace = performanceCalculator.calculate();

    matchPerformance(totalPerformace, atts.mods, performances);
  });
}
