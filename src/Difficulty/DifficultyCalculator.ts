import {
  IBeatmap,
  ProgressiveCalculationBeatmap,
  RulesetBeatmap,
} from '../Beatmaps';

import { IRuleset } from '../Rulesets';
import { ModCombination, IMod } from '../Mods';

import {
  DifficultyAttributes,
  TimedDifficultyAttributes,
} from './Attributes';

import { DifficultyHitObject } from './Preprocessing';
import { Skill } from './Skills';

export abstract class DifficultyCalculator<T extends DifficultyAttributes = DifficultyAttributes> {
  /**
   * The beatmap for which difficulty will be calculated.
   */
  protected _beatmap: IBeatmap;
  protected _ruleset: IRuleset;
  protected _mods: ModCombination;

  constructor(beatmap: IBeatmap, ruleset: IRuleset) {
    this._beatmap = beatmap;
    this._ruleset = ruleset;

    this._mods = (beatmap as RulesetBeatmap)?.mods
      ?? this._ruleset.createModCombination();
  }

  /**
   * Calculates the difficulty of the beatmap with no mods applied.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns A structure describing the difficulty of the beatmap.
   */
  calculate(clockRate?: number): T {
    return this.calculateWithMods(this._mods, clockRate);
  }

  /**
   * Calculates the difficulty of the beatmap using 
   * all mod combinations applicable to the beatmap.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns A collection of structures describing 
   * the difficulty of the beatmap for each mod combination.
   */
  *calculateAll(clockRate?: number): Generator<T> {
    for (const combination of this._createDifficultyModCombinations()) {
      yield this.calculateWithMods(combination, clockRate);
    }
  }

  /**
   * Calculates the difficulty of the beatmap using a specific mod combination.
   * @param mods The mods that should be applied to the beatmap.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns A structure describing the difficulty of the beatmap.
   */
  calculateWithMods(mods: ModCombination, clockRate?: number): T {
    const beatmap = this._getWorkingBeatmap(mods);

    clockRate ??= beatmap.difficulty.clockRate;

    const skills = this._createSkills(beatmap, mods, clockRate);

    if (!beatmap.hitObjects.length) {
      return this._createDifficultyAttributes(beatmap, mods, skills, clockRate);
    }

    for (const hitObject of this._getDifficultyHitObjects(beatmap, clockRate)) {
      for (const skill of skills) {
        skill.processInternal(hitObject);
      }
    }

    return this._createDifficultyAttributes(beatmap, mods, skills, clockRate);
  }

  /**
   * Calculates the difficulty of the beatmap at a specific object count.
   * @param objectCount How many objects to use for calculation?
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns Difficulty attributes at the specific object count.
   */
  calculateAt(objectCount?: number, clockRate?: number): T {
    return this.calculateWithModsAt(this._mods, objectCount, clockRate);
  }

  /**
   * Calculates the difficulty of the beatmap with applied mods at a sepcific object count.
   * @param mods The mods that should be applied to the beatmap.
   * @param objectCount How many objects to use for calculation?
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns Difficulty attributes at the specific object count.
   */
  calculateWithModsAt(mods: ModCombination, objectCount?: number, clockRate?: number): T {
    if (!objectCount) return this.calculateWithMods(mods);

    const beatmap = this._getWorkingBeatmap(mods);

    clockRate ??= beatmap.difficulty.clockRate;

    const skills = this._createSkills(beatmap, mods, clockRate);

    if (!beatmap.hitObjects.length || objectCount <= 0) {
      return this._createDifficultyAttributes(beatmap, mods, skills, clockRate);
    }

    const progressiveBeatmap = new ProgressiveCalculationBeatmap(beatmap);

    for (const hitObject of this._getDifficultyHitObjects(beatmap, clockRate)) {
      progressiveBeatmap.hitObjects.push(hitObject.baseObject);

      for (const skill of skills) {
        skill.processInternal(hitObject);
      }

      // Progressive beatmap has enough objects to calculate difficulty.
      if (progressiveBeatmap.hitObjects.length >= objectCount) break;
    }

    return this._createDifficultyAttributes(progressiveBeatmap, mods, skills, clockRate);
  }

  /**
   * Calculates the difficulty of the beatmap with no mods applied 
   * and returns a set of timed difficulty attributes 
   * representing the difficulty at every relevant time value in the beatmap.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns The set of timed difficulty attributes.
   */
  calculateTimed(clockRate?: number): TimedDifficultyAttributes<T>[] {
    return this.calculateTimedWithMods(this._mods, clockRate);
  }

  /**
   * Calculates the difficulty of the beatmap using a specific mod combination 
   * and returns a set of timed difficulty attributes representing 
   * the difficulty at every relevant time value in the beatmap.
   * @param mods The mods that should be applied to the beatmap.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns The set of timed difficulty attributes.
   */
  calculateTimedWithMods(mods: ModCombination, clockRate?: number): TimedDifficultyAttributes<T>[] {
    const beatmap = this._getWorkingBeatmap(mods);
    const attributes: TimedDifficultyAttributes<T>[] = [];

    if (!beatmap.hitObjects.length) return attributes;

    clockRate ??= beatmap.difficulty.clockRate;

    const skills = this._createSkills(beatmap, mods, clockRate);
    const progressiveBeatmap = new ProgressiveCalculationBeatmap(beatmap);

    for (const hitObject of this._getDifficultyHitObjects(beatmap, clockRate)) {
      progressiveBeatmap.hitObjects.push(hitObject.baseObject);

      for (const skill of skills) {
        skill.processInternal(hitObject);
      }

      const time = hitObject.endTime * clockRate;
      const atts = this._createDifficultyAttributes(progressiveBeatmap, mods, skills, clockRate);

      attributes.push(new TimedDifficultyAttributes(time, atts));
    }

    return attributes;
  }

  /**
   * Creates a new copy of a beatmap and applies ruleset & mods to it.
   * @param mods The mods that should be applied to the beatmap.
   * @returns The properly converted beatmap.
   */
  private _getWorkingBeatmap(mods: ModCombination): RulesetBeatmap {
    const rulesetBeatmap = this._beatmap as RulesetBeatmap;

    const sameRuleset = this._beatmap.mode === this._ruleset.id;
    const sameMods = rulesetBeatmap.mods?.equals(mods) ?? false;

    /**
     * Skip this beatmap conversion as we already have target beatmap.
     */
    if (sameRuleset && sameMods) return rulesetBeatmap;

    /**
     * Prefer base beatmap over converted beatmaps.
     * Applying different rulesets or mod combinations 
     * for already converted beatmaps is broken.
     */
    const original = this._beatmap.base ?? this._beatmap;

    return this._ruleset.applyToBeatmapWithMods(original, mods);
  }

  /**
   * @param beatmap The beatmap for creating difficulty hit objects.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns The difficulty hit objects to calculate against.
   */
  private _getDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): Iterable<DifficultyHitObject> {
    return this._sortObjects(this._createDifficultyHitObjects(beatmap, clockRate));
  }

  /**
   * Sorts a given set of difficulty hit objects.
   * @param input The difficulty hit objects to sort.
   * @returns The sorted difficulty hit objects.
   */
  protected _sortObjects(input: Generator<DifficultyHitObject>): Iterable<DifficultyHitObject> {
    return [...input].sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Creates all mod combinations which adjust the beatmap difficulty.
   */
  protected _createDifficultyModCombinations(): Generator<ModCombination> {
    const ruleset = this._ruleset;

    function* createModCombinations(remainingMods: IMod[], currentSet: IMod[]): Generator<ModCombination> {
      const bitwise = currentSet.reduce((p, c) => p + c.bitwise, 0);

      yield ruleset.createModCombination(bitwise);

      /**
       * Apply the rest of the remaining mods recursively.
       */
      for (let i = 0; i < remainingMods.length; ++i) {
        const nextMod = remainingMods[i];

        /**
         * Check if any mods in the next set are incompatible with any of the current set.
         */
        if (currentSet.find((m) => m.incompatibles & nextMod.bitwise)) {
          continue;
        }

        /**
         * Check if any mods in the next set are the same type as the current set. 
         * Mods of the exact same type are not incompatible with themselves.
         */
        if (currentSet.find((m) => m.bitwise & nextMod.bitwise)) {
          continue;
        }

        /**
         * If all's good, attach the next set to the current set and recurse further.
         */
        const nextRemaining = remainingMods.slice(i + 1);
        const nextSet = [...currentSet, nextMod];

        const combinations = createModCombinations(nextRemaining, nextSet);

        for (const combination of combinations) {
          yield combination;
        }
      }
    }

    return createModCombinations(this.difficultyMods, []);
  }

  get difficultyMods(): IMod[] {
    return [];
  }

  /**
   * Creates difficulty attributes to describe beatmap's calculated difficulty.
   * @param beatmap The IBeatmap whose difficulty was calculated.
   * This may differ from Beatmap in the case of timed calculation.
   * @param mods The mods that difficulty was calculated with.
   * @param skills The skills which processed the beatmap.
   * @param clockRate Custom clock rate for the difficulty calculation.
   */
  protected abstract _createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: ModCombination,
    skills: Skill[],
    clockRate: number,
  ): T;

  /**
   * Enumerates difficulty hit objects to be processed from hit objects in the IBeatmap.
   * @param beatmap The IBeatmap providing the hit objects to enumerate.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns The enumerated difficulty hit objects.
   */
  protected abstract _createDifficultyHitObjects(beatmap: IBeatmap, clockRate: number): Generator<DifficultyHitObject>;

  /**
   * Creates the Skills to calculate the difficulty of an IBeatmap.
   * @param beatmap The IBeatmap whose difficulty will be calculated.
   * This may differ from Beatmap in the case of timed calculation.
   * @param mods The mods to calculate difficulty with.
   * @param clockRate Custom clock rate for the difficulty calculation.
   * @returns The skills.
   */
  protected abstract _createSkills(beatmap: IBeatmap, mods: ModCombination, clockRate: number): Skill[];
}
