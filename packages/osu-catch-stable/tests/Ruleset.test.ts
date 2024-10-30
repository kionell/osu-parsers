import fs from 'fs';
import path from 'path';
import { IHitStatistics, IScoreInfo, ScoreInfo } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { ITestAttributes, IModdedAttributes } from './Attributes';
import {
  CatchRuleset,
  CatchDifficultyAttributes,
  CatchBeatmap,
  JuiceFruit,
  JuiceTinyDroplet,
  JuiceDroplet,
} from '../src';

const ruleset = new CatchRuleset();
const decoder = new BeatmapDecoder();

describe('Standard converted beatmaps', () => testRuleset('Standard'));
describe('Catch specific beatmaps', () => testRuleset('Catch'));
describe('Mania converted beatmaps', () => testRuleset('Mania'));

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

function testBeatmap(beatmap: CatchBeatmap, data: ITestAttributes): void {
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

    it('Should match approach rate', () => {
      expect(difficulty.approachRate).toBeCloseTo(data.approachRate, 6);
    });

    it('Should match total star rating', () => {
      expect(difficulty.starRating).toBeCloseTo(data.starRating, 6);
    });

    it('Should match total performance', () => {
      expect(performance.totalPerformance).toBeCloseTo(data.totalPerformance, 6);
    });
  });
}

function simulateScore(beatmap: CatchBeatmap, attributes: CatchDifficultyAttributes): IScoreInfo {
  return new ScoreInfo({
    maxCombo: attributes.maxCombo,
    mods: attributes.mods,
    statistics: getStatistics(beatmap),
    accuracy: 1,
  });
}

function getStatistics(beatmap: CatchBeatmap): Partial<IHitStatistics> {
  const nestedFruits = beatmap.hitObjects.reduce((f, h) => {
    const nested = h.nestedHitObjects;

    return f + nested.reduce((f, h) => f + (h instanceof JuiceFruit ? 1 : 0), 0);
  }, 0);

  const smallTickHit = beatmap.hitObjects.reduce((t, h) => {
    return t + h.nestedHitObjects.reduce((t, h) => {
      return t + (h instanceof JuiceTinyDroplet ? 1 : 0);
    }, 0);
  }, 0);

  const tickHit = beatmap.hitObjects.reduce((t, h) => {
    return t + h.nestedHitObjects.reduce((t, h) => {
      return t + (h instanceof JuiceDroplet ? 1 : 0);
    }, 0);
  }, 0);

  return {
    great: beatmap.fruits + nestedFruits,
    largeTickHit: tickHit - smallTickHit,
    smallTickHit,
  };
}
