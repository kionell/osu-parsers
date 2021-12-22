import { Beatmap } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from '../src/StandardRuleset';

import { matchBeatmapWithMods } from './Utils';

const decoder = new BeatmapDecoder();
const ruleset = new StandardRuleset();

/**
 * One of the oldest maps in the game, which was published in 2007.
 * Uses v7 format and does not contain most of the properties.
 */
describe('Ni-Ni - 1,2,3,4, 007 [Wipeout Series] (MCXD) [-Breezin-]', () => {
  const beatmap = decoder.decodeFromPath('./tests/Standard/Beatmaps/91.osu');

  test('Matching calculated values:', () => {
    const standardBeatmap = ruleset.applyToBeatmap(beatmap);

    expect(standardBeatmap.bpmMin).toBeCloseTo(172);
    expect(standardBeatmap.bpmMode).toBeCloseTo(172);
    expect(standardBeatmap.bpmMax).toBeCloseTo(172);

    expect(standardBeatmap.fileFormat).toEqual(7);
    expect(standardBeatmap.mode).toEqual(0);

    expect(standardBeatmap.circles).toEqual(36);
    expect(standardBeatmap.sliders).toEqual(7);
    expect(standardBeatmap.spinners).toEqual(1);
    expect(standardBeatmap.hitObjects.length).toEqual(44);

    expect(standardBeatmap.maxCombo).toEqual(96);
    expect(standardBeatmap.length).toEqual(80581);
    expect(standardBeatmap.totalBreakTime).toEqual(0);
  });

  test('Applying Hard Rock:', () => matchHardRockMod(beatmap));
  test('Applying Easy:', () => matchEasyMod(beatmap));

  // Check if beatmap was copied properly and didn't mutated from the converts.
  test('Reseting mods:', () => matchResetMods(beatmap));
});

/**
 * Average 4* map with stacked objects at the beggining.
 */
describe('MuryokuP - Catastrophe (meiikyuu) [Cataclysm]', () => {
  const beatmap = decoder.decodeFromPath('./tests/Standard/Beatmaps/207659.osu');

  test('Matching calculated values:', () => {
    const standardBeatmap = ruleset.applyToBeatmap(beatmap);

    expect(standardBeatmap.bpmMin).toBeCloseTo(200);
    expect(standardBeatmap.bpmMode).toBeCloseTo(200);
    expect(standardBeatmap.bpmMax).toBeCloseTo(200);

    expect(standardBeatmap.fileFormat).toEqual(12);
    expect(standardBeatmap.mode).toEqual(0);

    expect(standardBeatmap.circles).toEqual(269);
    expect(standardBeatmap.sliders).toEqual(284);
    expect(standardBeatmap.spinners).toEqual(2);
    expect(standardBeatmap.hitObjects.length).toEqual(555);

    expect(standardBeatmap.maxCombo).toEqual(881);
    expect(standardBeatmap.length).toEqual(149400);
    expect(standardBeatmap.totalBreakTime).toEqual(6700);

    // This map contains object stacking at the beginning
    expect(standardBeatmap.hitObjects[0].stackHeight).toEqual(8);
    expect(standardBeatmap.hitObjects[1].stackHeight).toEqual(7);
    expect(standardBeatmap.hitObjects[2].stackHeight).toEqual(6);
  });

  test('Applying Hard Rock:', () => matchHardRockMod(beatmap));
  test('Applying Easy:', () => matchEasyMod(beatmap));

  // Check if beatmap was copied properly and didn't mutated from the converts.
  test('Reseting mods:', () => matchResetMods(beatmap));
});

/**
 * 2B map with broken sliders. This map contains objects 
 * that can start earlier than the end of the previous one.
 * Mania converted map is not playable.
 */
describe('TheFatRat - Mayday (feat. Laura Brehm) (Voltaeyx) [[2B] Calling Out Mayday]', () => {
  const beatmap = decoder.decodeFromPath('./tests/Standard/Beatmaps/1605148.osu');

  test('Matching calculated values:', () => {
    const standardBeatmap = ruleset.applyToBeatmap(beatmap);

    expect(standardBeatmap.bpmMin).toBeCloseTo(9.375);
    expect(standardBeatmap.bpmMode).toBeCloseTo(75);
    expect(standardBeatmap.bpmMax).toBeCloseTo(600);

    expect(standardBeatmap.fileFormat).toEqual(14);
    expect(standardBeatmap.mode).toEqual(0);

    expect(standardBeatmap.circles).toEqual(234);
    expect(standardBeatmap.sliders).toEqual(815);
    expect(standardBeatmap.spinners).toEqual(0);
    expect(standardBeatmap.hitObjects.length).toEqual(1049);

    expect(standardBeatmap.maxCombo).toEqual(1925);
    expect(standardBeatmap.length).toEqual(240000);
    expect(standardBeatmap.totalBreakTime).toEqual(2200);
  });

  test('Applying Hard Rock:', () => matchHardRockMod(beatmap));
  test('Applying Easy:', () => matchEasyMod(beatmap));

  // Check if beatmap was copied properly and didn't mutated from the converts.
  test('Reseting mods:', () => matchResetMods(beatmap));
});

/**
 * Super long beatmap with 15k objects and 75 min length.
 */
describe('Various Artists - Kagerou Project Compilation (Nevo) [Kagerou]', () => {
  const beatmap = decoder.decodeFromPath('./tests/Standard/Beatmaps/2570401.osu');

  test('Matching calculated values:', () => {
    const standardBeatmap = ruleset.applyToBeatmap(beatmap);

    expect(standardBeatmap.bpmMin).toBeCloseTo(27.6);
    expect(standardBeatmap.bpmMode).toBeCloseTo(195);
    expect(standardBeatmap.bpmMax).toBeCloseTo(295);

    expect(standardBeatmap.fileFormat).toEqual(14);
    expect(standardBeatmap.mode).toEqual(0);

    expect(standardBeatmap.circles).toEqual(7905);
    expect(standardBeatmap.sliders).toEqual(6849);
    expect(standardBeatmap.spinners).toEqual(19);
    expect(standardBeatmap.hitObjects.length).toEqual(14773);

    expect(standardBeatmap.maxCombo).toEqual(22255);
    expect(standardBeatmap.length).toEqual(4499619);
    expect(standardBeatmap.totalBreakTime).toEqual(338860);
  });

  test('Applying Hard Rock:', () => matchHardRockMod(beatmap));
  test('Applying Easy:', () => matchEasyMod(beatmap));

  // Check if beatmap was copied properly and didn't mutated from the converts.
  test('Reseting mods:', () => matchResetMods(beatmap));
});

function matchHardRockMod(beatmap: Beatmap) {
  const mods = ruleset.createModCombination('HR');
  const beatmapWithHR = ruleset.applyToBeatmapWithMods(beatmap, mods);

  matchBeatmapWithMods(beatmap, beatmapWithHR, mods);
}

function matchEasyMod(beatmap: Beatmap) {
  const mods = ruleset.createModCombination('EZ');
  const beatmapWithEZ = ruleset.applyToBeatmapWithMods(beatmap, mods);

  matchBeatmapWithMods(beatmap, beatmapWithEZ, mods);
}

function matchResetMods(beatmap: Beatmap) {
  matchBeatmapWithMods(beatmap, ruleset.resetMods(beatmap));
}
