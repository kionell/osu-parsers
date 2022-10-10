import fs from 'fs';
import path from 'path';
import { IScoreInfo, ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { ITestAttributes, IModdedAttributes } from './Attributes';
import { ManiaRuleset, ManiaBeatmap } from '../src';

const ruleset = new ManiaRuleset();
const decoder = new BeatmapDecoder();

describe('Standard converted beatmaps', () => testRuleset('Standard'));
describe('Catch converted beatmaps', () => testRuleset('Catch'));
describe('Mania specific beatmaps', () => testRuleset('Mania'));

function testRuleset(rulesetName: string): void {
  const rulesetPath = path.resolve(__dirname, `./Files/${rulesetName}`);

  testBeatmaps(rulesetPath);
}

function testBeatmaps(rulesetPath: string): void {
  const beatmapsPath = path.resolve(rulesetPath, './Beatmaps');
  const beatmapFiles = fs.readdirSync(beatmapsPath);

  for (const beatmapFile of beatmapFiles) {
    const beatmapPath = path.resolve(beatmapsPath, beatmapFile);
    const beatmapId = beatmapFile.split('.')[0];

    const attributesPath = `${rulesetPath}/Attributes/${beatmapId}.json`;
    const attributesData = fs.readFileSync(attributesPath).toString();
    const attributes: IModdedAttributes = JSON.parse(attributesData);

    const decoded = decoder.decodeFromPath(beatmapPath, false);

    for (const acronym in attributes) {
      const mods = ruleset.createModCombination(acronym);
      const beatmap = ruleset.applyToBeatmapWithMods(decoded, mods);

      testBeatmap(beatmap, attributes[acronym]);
    }
  }
}

function testBeatmap(beatmap: ManiaBeatmap, data: ITestAttributes): void {
  const acronyms = beatmap.mods.toString();

  const difficultyCalculator = ruleset.createDifficultyCalculator(beatmap);
  const difficulty = difficultyCalculator.calculate();

  const score = simulateScore(beatmap);
  const performanceCalculator = ruleset.createPerformanceCalculator(difficulty, score);
  const performance = performanceCalculator.calculateAttributes();

  const { artist, title, version } = beatmap.metadata;

  describe(`${artist} - ${title} [${version}] +${acronyms}`, () => {
    it('Should match beatmap max combo', () => {
      expect(difficulty.maxCombo).toEqual(data.maxCombo);
    });

    it('Should match total star rating', () => {
      expect(difficulty.starRating).toBeCloseTo(data.starRating, 1);
    });

    it('Should match great hit window', () => {
      expect(difficulty.greatHitWindow).toBeCloseTo(data.greatHitWindow, 1);
    });

    it('Should match total performance', () => {
      expect(performance.totalPerformance).toBeCloseTo(data.totalPerformance, 1);
    });

    it('Should match difficulty performance', () => {
      expect(performance.difficultyPerformance).toBeCloseTo(data.difficultyPerformance, 1);
    });
  });
}

function simulateScore(beatmap: ManiaBeatmap): IScoreInfo {
  return new ScoreInfo({
    maxCombo: beatmap.maxCombo,
    mods: beatmap.mods,
    accuracy: 1,
    statistics: {
      perfect: beatmap.hitObjects.length,
    },
  });
}
