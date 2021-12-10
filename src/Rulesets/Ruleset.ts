import {
  BeatmapProcessor,
  BeatmapConverter,
  RulesetBeatmap,
  IBeatmap,
} from '../Beatmaps';

import {
  DifficultyAttributes,
  DifficultyCalculator,
  PerformanceCalculator,
} from '../Difficulty';

import { ModCombination } from '../Mods';
import { ScoreInfo } from '../Scoring';
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
    if (beatmap.mode !== mods.mode) {
      mods = this.createModCombination(mods.bitwise);
    }

    const converter = this.createBeatmapConverter();

    const cloned = beatmap.clone();

    /**
     * Check if the beatmap can be converted.
     */
    if (beatmap.hitObjects.length > 0 && !converter.canConvert(cloned)) {
      throw new Error('Beatmap can not be converted!');
    }

    /**
     * Apply conversion mods.
     */
    mods.converterMods.forEach((m) => m.applyToConverter(converter));

    const converted = converter.convertBeatmap(cloned);

    /**
     * Apply difficulty mods.
     */
    mods.difficultyMods.forEach((m) => {
      m.applyToDifficulty(converted.difficulty);
    });

    const processor = this.createBeatmapProcessor();

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

    converted.mods = mods;

    return converted;
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
  abstract createBeatmapProcessor(): BeatmapProcessor;

  /**
   * @returns A new beatmap converter.
   */
  abstract createBeatmapConverter(): BeatmapConverter;

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
  abstract createPerformanceCalculator(attributes: DifficultyAttributes, score: ScoreInfo): PerformanceCalculator;
}
