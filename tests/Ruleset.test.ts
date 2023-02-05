import fs from 'fs';
import path from 'path';
import { IScoreInfo, ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { ITestAttributes, IModdedAttributes } from './Attributes';
import {
  StandardRuleset,
  StandardDifficultyAttributes,
  StandardBeatmap,
  StandardHardRock,
} from '../src';

const ruleset = new StandardRuleset();
const decoder = new BeatmapDecoder();

describe('Standard specific beatmaps', () => testRuleset('Standard'));

function testRuleset(rulesetName: string): void {
  const rulesetPath = path.resolve(__dirname, `./Files/${rulesetName}`);

  testBeatmaps(rulesetPath);
}

function testBeatmaps(rulesetPath: string): void {
  const beatmapsPath = path.resolve(rulesetPath, './Beatmaps');
  const beatmapFiles = fs.readdirSync(beatmapsPath);
  const modHardRock = new StandardHardRock();

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

      // Unflip hit objects if they were flipped by applying HR.
      if (mods.any(StandardHardRock)) {
        modHardRock.applyToHitObjects(beatmap.hitObjects);
      }
    }
  }
}

function testBeatmap(beatmap: StandardBeatmap, data: ITestAttributes): void {
  const acronyms = beatmap.mods.toString();

  const difficultyCalculator = ruleset.createDifficultyCalculator(beatmap);
  const difficulty = difficultyCalculator.calculate();

  const score = simulateScore(beatmap, difficulty);
  const performanceCalculator = ruleset.createPerformanceCalculator(difficulty, score);
  const performance = performanceCalculator.calculateAttributes();

  const { artist, title, version } = beatmap.metadata;

  describe(`${artist} - ${title} [${version}] +${acronyms}`, () => {
    it('Should match beatmap max combo', () => {
      expect(difficulty.maxCombo).toEqual(data.maxCombo);
    });

    test('Should match total star rating', () => {
      expect(difficulty.starRating).toBeCloseTo(data.starRating, 15);
    });

    test('Should match aim difficulty', () => {
      expect(difficulty.aimDifficulty).toBeCloseTo(data.aimDifficulty, 15);
    });

    test('Should match speed difficulty', () => {
      expect(difficulty.speedDifficulty).toBeCloseTo(data.speedDifficulty, 15);
    });

    test('Should match speed note count', () => {
      expect(difficulty.speedNoteCount).toBeCloseTo(data.speedNoteCount, 15);
    });

    test('Should match flashlight difficulty', () => {
      expect(difficulty.flashlightDifficulty).toBeCloseTo(data.flashlightDifficulty, 15);
    });

    test('Should match slider factor', () => {
      expect(difficulty.sliderFactor).toBeCloseTo(data.sliderFactor, 6);
    });

    test('Should match approach rate', () => {
      expect(difficulty.approachRate).toBeCloseTo(data.approachRate, 2);
    });

    test('Should match overall difficulty', () => {
      expect(difficulty.overallDifficulty).toBeCloseTo(data.overallDifficulty, 2);
    });

    test('Should match total performance', () => {
      expect(performance.totalPerformance).toBeCloseTo(data.totalPerformance, 15);
    });

    test('Should match aim performance', () => {
      expect(performance.aimPerformance).toBeCloseTo(data.aimPerformance, 15);
    });

    test('Should match speed performance', () => {
      expect(performance.speedPerformance).toBeCloseTo(data.speedPerformance, 15);
    });

    test('Should match accuracy performance', () => {
      expect(performance.accuracyPerformance).toBeCloseTo(data.accuracyPerformance, 15);
    });

    test('Should match flashlight performance', () => {
      expect(performance.flashlightPerformance).toBeCloseTo(data.flashlightPerformance, 15);
    });

    test('Should match effective miss count', () => {
      expect(performance.effectiveMissCount).toBeCloseTo(data.effectiveMissCount, 6);
    });
  });
}

function simulateScore(beatmap: StandardBeatmap, attributes: StandardDifficultyAttributes): IScoreInfo {
  return new ScoreInfo({
    maxCombo: attributes.maxCombo,
    mods: attributes.mods,
    accuracy: 1,
    statistics: {
      great: beatmap.hitObjects.length,
    },
  });
}
