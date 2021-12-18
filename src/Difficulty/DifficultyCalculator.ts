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

export abstract class DifficultyCalculator {
  /**
   * The beatmap for which difficulty will be calculated.
   */
  protected _beatmap: IBeatmap;
  protected _ruleset: IRuleset;
  private _clockRate = 1;

  constructor(beatmap: IBeatmap, ruleset: IRuleset) {
    this._beatmap = beatmap;
    this._ruleset = ruleset;
  }

  /**
   * Calculates the difficulty of the beatmap with no mods applied.
   * @returns A structure describing the difficulty of the beatmap.
   */
  calculate(): DifficultyAttributes {
    const mods = (this._beatmap as RulesetBeatmap).mods;

    return this.calculateWithMods(mods ?? this._ruleset.createModCombination());
  }

  /**
   * Calculates the difficulty of the beatmap using 
   * all mod combinations applicable to the beatmap.
   * @returns A collection of structures describing 
   * the difficulty of the beatmap for each mod combination.
   */
  *calculateAll(): Generator<DifficultyAttributes> {
    for (const combination of this._createDifficultyModCombinations()) {
      yield this.calculateWithMods(combination);
    }
  }

  /**
   * Calculates the difficulty of the beatmap using a specific mod combination.
   * @param mods The mods that should be applied to the beatmap.
   * @returns A structure describing the difficulty of the beatmap.
   */
  calculateWithMods(mods: ModCombination): DifficultyAttributes {
    const beatmap = this._getWorkingBeatmap(mods);
    const skills = this._createSkills(beatmap, mods);

    if (!beatmap.hitObjects.length) {
      return this._createDifficultyAttributes(beatmap, mods, skills);
    }

    for (const hitObject of this._getDifficultyHitObjects(beatmap)) {
      for (const skill of skills) {
        skill.processInternal(hitObject);
      }
    }

    return this._createDifficultyAttributes(beatmap, mods, skills);
  }

  /**
   * Calculates the difficulty of the beatmap with no mods applied 
   * and returns a set of timed difficulty attributes 
   * representing the difficulty at every relevant time value in the beatmap.
   * @returns The set of TimedDifficultyAttributes.
   */
  calculateTimed(): TimedDifficultyAttributes[] {
    return this.calculateTimedWithMods(this._ruleset.createModCombination());
  }

  /**
   * Calculates the difficulty of the beatmap using a specific mod combination 
   * and returns a set of timed difficulty attributes representing 
   * the difficulty at every relevant time value in the beatmap.
   * @param mods The mods that should be applied to the beatmap.
   * @returns The set of timed difficulty attributes.
   */
  calculateTimedWithMods(mods: ModCombination): TimedDifficultyAttributes[] {
    const beatmap = this._getWorkingBeatmap(mods);
    const attributes: TimedDifficultyAttributes[] = [];

    if (!beatmap.hitObjects.length) return attributes;

    const skills = this._createSkills(beatmap, mods);
    const progressiveBeatmap = new ProgressiveCalculationBeatmap(beatmap);

    for (const hitObject of this._getDifficultyHitObjects(beatmap)) {
      progressiveBeatmap.hitObjects.push(hitObject.baseObject);

      for (const skill of skills) {
        skill.processInternal(hitObject);
      }

      const time = hitObject.endTime * this._clockRate;
      const atts = this._createDifficultyAttributes(progressiveBeatmap, mods, skills);

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
    const beatmap = this._beatmap as RulesetBeatmap;

    const sameRuleset = beatmap.mode === this._ruleset.id;
    const sameMods = beatmap?.mods?.bitwise === mods.bitwise;

    if (!sameRuleset || !sameMods) {
      /**
       * Prefer base beatmap over converted beatmaps.
       * Applying different rulesets or mod combinations 
       * for already converted beatmaps is broken.
       */
      const original = this._beatmap.base ?? this._beatmap;

      return this._ruleset.applyToBeatmapWithMods(original, mods);
    }

    return beatmap;
  }

  /**
   * @param beatmap The beatmap for creating difficulty hit objects.
   * @returns The difficulty hit objects to calculate against.
   */
  private _getDifficultyHitObjects(beatmap: IBeatmap): Iterable<DifficultyHitObject> {
    return this._sortObjects(this._createDifficultyHitObjects(beatmap));
  }

  /**
   * Sorts a given set of DifficultyHitObjects.
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
   */
  protected abstract _createDifficultyAttributes(beatmap: IBeatmap, mods: ModCombination, skills: Skill[]): DifficultyAttributes;

  /**
   * Enumerates difficulty hit objects to be processed from hit objects in the IBeatmap.
   * @param beatmap The IBeatmap providing the hit objects to enumerate.
   * @returns The enumerated difficulty hit objects.
   */
  protected abstract _createDifficultyHitObjects(beatmap: IBeatmap): Generator<DifficultyHitObject>;

  /**
   * Creates the Skills to calculate the difficulty of an IBeatmap.
   * @param beatmap The IBeatmap whose difficulty will be calculated.
   * This may differ from Beatmap in the case of timed calculation.
   * @param mods The mods to calculate difficulty with.
   * @returns The skills.
   */
  protected abstract _createSkills(beatmap: IBeatmap, mods: ModCombination): Skill[];
}
