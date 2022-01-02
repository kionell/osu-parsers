import fs from 'fs';
import path from 'path';

import { Beatmap } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';

import {
  ILoadedFiles,
  IBeatmapValues,
  IStarRatings,
  IPerformances,
} from '../Interfaces';

import { BeatmapMatcher } from './BeatmapMatcher';
import { ManiaBeatmap, ManiaRuleset } from '../../src';

export class BeatmapTester {
  /**
   * An instance of a beatmap decoder.
   */
  private _decoder: BeatmapDecoder = new BeatmapDecoder();

  /**
   * An instance of a ruleset.
   */
  private _ruleset = new ManiaRuleset();

  /**
   * A beatmap ID.
   */
  beatmapID: string | number;

  /**
   * A beatmap which will be tested.
   */
  beatmap: ManiaBeatmap;

  /**
   * A matcher that will be used to compare values.
   */
  matcher: BeatmapMatcher;

  /**
   * A path to the beatmap files folder.
   */
  dirPath: string;

  constructor(dirPath: string, id: string | number, decoded: Beatmap) {
    this.dirPath = dirPath;
    this.beatmapID = id;
    this.beatmap = this._ruleset.applyToBeatmap(decoded);
    this.matcher = new BeatmapMatcher(this.beatmap);
  }

  test(loadedFiles: ILoadedFiles): void {
    const { values, starRatings, performances } = loadedFiles;

    test('Match beatmap values', () => this.matcher.matchBeatmapValues(values));

    const beatmaps = this.matcher.beatmaps;
    const attributes = this.matcher.calculateDifficultyAttributes(beatmaps);

    test('Match star ratings', () => this.matcher.matchStarRatings(starRatings, attributes));
    test('Match performaces', () => this.matcher.matchPerformances(performances, attributes, beatmaps));
  }

  loadFiles(): ILoadedFiles {
    const valuesPath = path.resolve(this.dirPath, '../Values');
    const starsPath = path.resolve(this.dirPath, '../Stars');
    const performancesPath = path.resolve(this.dirPath, '../Performances');

    const values = fs.readFileSync(`${valuesPath}/${this.beatmapID}.json`).toString();
    const starRatings = fs.readFileSync(`${starsPath}/${this.beatmapID}.json`).toString();
    const performances = fs.readFileSync(`${performancesPath}/${this.beatmapID}.json`).toString();

    return {
      values: JSON.parse(values) as IBeatmapValues,
      starRatings: JSON.parse(starRatings) as IStarRatings,
      performances: JSON.parse(performances) as IPerformances,
    };
  }
}
