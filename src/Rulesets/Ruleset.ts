import {
  BeatmapProcessor,
  BeatmapConverter,
  RulesetBeatmap,
  IBeatmap,
} from '../Beatmaps';

import {
  IReplay,
  Replay,
  ReplayConverter,
} from '../Replays';

import {
  DifficultyAttributes,
  DifficultyCalculator,
  PerformanceCalculator,
} from '../Difficulty';

import { ModCombination } from '../Mods';
import { IScoreInfo } from '../Scoring';
import { IRuleset } from './IRuleset';

/**
 * A ruleset.
 */
export abstract class Ruleset implements IRuleset {
  /**
   * Ruleset ID.
   */
  abstract id: number;

  /**
   * Applies ruleset to a beatmap.
   * @param beatmap The beatmap.
   * @returns A new instance of the beatmap with applied ruleset.
   */
  applyToBeatmap(beatmap: IBeatmap): RulesetBeatmap {
    const originalMods = (beatmap as RulesetBeatmap).mods;

    const bitwise = originalMods ? originalMods.bitwise : 0;

    const mods = this.createModCombination(bitwise);

    return this.applyToBeatmapWithMods(beatmap, mods);
  }

  /**
   * Applies ruleset and mods to a beatmap.
   * @param beatmap The beatmap.
   * @param mods Mod combination.
   * @returns A new beatmap with applied mods.
   */
  applyToBeatmapWithMods(beatmap: IBeatmap, mods?: ModCombination): RulesetBeatmap {
    if (!mods) {
      mods = this.createModCombination(0);
    }

    /**
     * We should apply mods only from the same ruleset.
     */
    if (this.id !== mods.mode) {
      mods = this.createModCombination(mods.bitwise);
    }

    const converter = this._createBeatmapConverter();

    /**
     * Check if the beatmap can be converted.
     */
    if (beatmap.hitObjects.length > 0 && !converter.canConvert(beatmap)) {
      throw new Error('Beatmap can not be converted to this ruleset!');
    }

    /**
     * Apply conversion mods.
     */
    mods.converterMods.forEach((m) => m.applyToConverter(converter));

    const converted = converter.convertBeatmap(beatmap);

    converted.mods = mods;

    /**
     * Apply difficulty mods.
     */
    mods.difficultyMods.forEach((m) => {
      m.applyToDifficulty(converted.difficulty);
    });

    const processor = this._createBeatmapProcessor();

    processor.preProcess(converted);

    /**
     * Compute default values for hitobjects, 
     * including creating nested hitobjects in-case they're needed.
     */
    converted.hitObjects.forEach((hitObject) => {
      hitObject.applyDefaults(converted.controlPoints, converted.difficulty);
    });

    mods.hitObjectMods.forEach((m) => {
      m.applyToHitObjects(converted.hitObjects);
    });

    processor.postProcess(converted);

    mods.beatmapMods.forEach((m) => m.applyToBeatmap(converted));

    return converted;
  }

  /**
   * Applies ruleset to a replay.
   * Converts legacy replay frames to ruleset specific frames.
   * @param replay The replay.
   * @param beatmap The beatmap of the replay which is used to get some data.
   * @returns A new instance of the replay with applied ruleset.
   */
  applyToReplay(replay: IReplay, beatmap: IBeatmap): Replay {
    if (replay.mode !== beatmap.mode) {
      throw new Error('Replay and beatmap mode does not match!');
    }

    const converter = this._createReplayConverter();

    return converter.convertReplay(replay, beatmap);
  }

  /**
   * Resets a mod combination from a beatmap.
   * @param beatmap The beatmap.
   * @returns A new beatmap with no mods.
   */
  resetMods(beatmap: IBeatmap): RulesetBeatmap {
    const mods = this.createModCombination(0);

    return this.applyToBeatmapWithMods(beatmap, mods);
  }

  /**
   * Creates a new mod combination by converting legacy mod bitwise or string acronyms.
   * @param input Mod bitwise or string acronyms.
   * @returns A new mod combination.
   */
  abstract createModCombination(input?: number | string): ModCombination;

  /**
   * @returns A new beatmap processor.
   */
  protected abstract _createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  protected abstract _createBeatmapConverter(): BeatmapConverter;

  /**
   * @returns A new replay converter.
   */
  protected abstract _createReplayConverter(): ReplayConverter;

  /**
   * @param beatmap The beatmap for which the calculation will be done.
   * @returns A new difficulty calculator.
   */
  abstract createDifficultyCalculator(beatmap: IBeatmap): DifficultyCalculator;

  /**
   * @param attributes The difficulty attributes.
   * @param score Score information.
   * @returns A new performance calculator.
   */
  abstract createPerformanceCalculator(attributes?: DifficultyAttributes, score?: IScoreInfo): PerformanceCalculator;
}
