import { IMod } from './IMod';

import { IApplicableToBeatmap } from './Types/IApplicableToBeatmap';
import { IApplicableToHitObjects } from './Types/IApplicableToHitObjects';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';
import { IApplicableToConverter } from './Types/IApplicableToConverter';

/**
 * A mod combination.
 */
export abstract class ModCombination {
  private _mods: IMod[] = [];

  abstract get mode(): number;

  constructor(input?: number | string) {
    const available = this._availableMods;

    if (typeof input === 'number' || typeof input === 'string') {
      let bitwise = this.toBitwise(input);
      let mask = 1 << 30;

      while (mask > 0) {
        const found = available.find((m) => m.bitwise & bitwise & mask);

        if (found && !(this.bitwise & found.incompatibles)) {
          this._mods.push(found);
        }

        /**
         * Make the processed bit equal to 0.
         */
        bitwise &= ~mask;
        mask >>= 1;
      }
    }

    if (!this._mods.length) {
      const noMod = available.find((m) => m.bitwise === 0);

      if (noMod) this._mods.push(noMod);
    }

    this._mods.sort((a, b) => a.bitwise - b.bitwise);
  }

  /**
   * The list of all mods of this combination.
   */
  get all(): IMod[] {
    return this._mods;
  }

  /**
   * The list of mods that are applicable to the beatmap.
   */
  get beatmapMods(): IApplicableToBeatmap[] {
    const mods = this.all as IApplicableToBeatmap[];

    return mods.filter((m) => m.applyToBeatmap);
  }

  /**
   * The list of mods that are applicable to the beatmap hit objects.
   */
  get hitObjectMods(): IApplicableToHitObjects[] {
    const mods = this.all as IApplicableToHitObjects[];

    return mods.filter((m) => m.applyToHitObjects);
  }

  /**
   * The list of mods that are applicable to the beatmap difficulty.
   */
  get difficultyMods(): IApplicableToDifficulty[] {
    const mods = this.all as IApplicableToDifficulty[];

    return mods.filter((m) => m.applyToDifficulty);
  }

  /**
   * The list of mods that are applicable to the beatmap converter.
   */
  get converterMods(): IApplicableToConverter[] {
    const mods = this.all as IApplicableToConverter[];

    return mods.filter((m) => m.applyToConverter);
  }

  /**
   * The list of all mod names.
   */
  get names(): string[] {
    return this.all.map((m) => m.name);
  }

  /**
   * The list of all mod acronyms.
   */
  get acronyms(): string[] {
    return this.all.map((m) => m.acronym);
  }

  /**
   * Bitwise value of the mod combination.
   */
  get bitwise(): number {
    return this.all.reduce((b, m) => b | m.bitwise, 0);
  }

  /**
   * Score multiplier of the mod combination.
   */
  get multiplier(): number {
    return this.all.reduce((mp, m) => mp * m.multiplier, 1);
  }

  /**
   * Whether the mod combination is ranked.
   */
  get isRanked(): boolean {
    return this.all.reduce((r: boolean, m) => r && m.isRanked, true);
  }

  /**
   * Bitwise value of all mods incompatible with this mod combination.
   */
  get incompatibles(): number {
    return this.all.reduce((b, m) => b | m.incompatibles, 0);
  }

  /**
   * @param input The bitwise value or acronyms.
   * @returns If the mod combination contain all of the mods from this bitwise or acronyms.
   */
  has(input: number | string): boolean {
    const bitwise = this.toBitwise(input);

    return (this.bitwise & bitwise) === bitwise || this.bitwise === bitwise;
  }

  /**
   * Finds all mods that are applicable to the beatmap by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns The list of all found mods.
   */
  beatmapModsAt(input: number | string): IApplicableToBeatmap[] {
    const bitwise = this.toBitwise(input);
    const mods = this.all as IApplicableToBeatmap[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToBeatmap);
  }

  /**
   * Finds a mod that is applicable to the beatmap by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns First found mod. Otherwise returns null.
   */
  beatmapModAt(input: number | string): IApplicableToBeatmap {
    const bitwise = this.toBitwise(input);

    return this.beatmapModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap hit objects by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns The list of all found mods.
   */
  hitObjectModsAt(input: number | string): IApplicableToHitObjects[] {
    const bitwise = this.toBitwise(input);
    const mods = this.all as IApplicableToHitObjects[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToHitObjects);
  }

  /**
   * Finds a mod that is applicable to the beatmap hit objects by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns First found mod. Otherwise returns null.
   */
  hitObjectModAt(input: number | string): IApplicableToHitObjects {
    const bitwise = this.toBitwise(input);

    return this.hitObjectModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap difficulty by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns The list of all found mods.
   */
  difficultyModsAt(input: number | string): IApplicableToDifficulty[] {
    const bitwise = this.toBitwise(input);
    const mods = this.all as IApplicableToDifficulty[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToDifficulty);
  }

  /**
   * Finds a mod that is applicable to the beatmap difficulty by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns First found mod. Otherwise returns null.
   */
  difficultyModAt(input: number | string): IApplicableToDifficulty {
    const bitwise = this.toBitwise(input);

    return this.difficultyModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap converter by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns The list of all found mods.
   */
  converterModsAt(input: number | string): IApplicableToConverter[] {
    const bitwise = this.toBitwise(input);
    const mods = this.all as IApplicableToConverter[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToConverter);
  }

  /**
   * Finds a mod that is applicable to the beatmap converter by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns First found mod. Otherwise returns null.
   */
  converterModAt(input: number | string): IApplicableToConverter {
    const bitwise = this.toBitwise(input);

    return this.converterModsAt(bitwise)[0] || null;
  }

  /**
   * Finds mods by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns The list of all found mods.
   */
  modsAt(input: number | string): IMod[] {
    const bitwise = this.toBitwise(input);

    return this.all.filter((m) => m.bitwise & bitwise);
  }

  /**
   * Finds a mod by bitwise value or acronyms.
   * @param input The bitwise value or acronyms.
   * @returns First found mod. Otherwise returns null.
   */
  modAt(input: number | string): IMod {
    const bitwise = this.toBitwise(input);

    return this.modsAt(bitwise)[0] || null;
  }

  /**
   * Converts this mod combination to a string.
   * @returns Stringified mod combination.
   */
  toString(): string {
    return this.acronyms.join('');
  }

  /**
   * Converts mod acronyms to a bitwise value. 
   * @param input The mod acronyms.
   * @returns The bitwise value.
   */
  toBitwise(input: unknown): number {
    /**
     * Return the value if it's already number.
     */
    if (typeof input === 'number') return Math.max(0, input);

    /**
     * We don't want to work with any non-string types or falsy values.
     */
    if (typeof input !== 'string' || !input) return 0;

    /**
     * Correct acronyms must contain an even number of characters
     */
    if (input.length % 2) return 0;

    const acronyms = input.match(/.{1,2}/g)?.map((a) => a.toUpperCase()) ?? [];

    return acronyms.reduce((bitwise, acronym) => {
      const found = this._availableMods.find((m) => m.acronym === acronym);

      return bitwise | (found?.bitwise ?? 0);
    }, 0);
  }

  protected get _availableMods(): IMod[] {
    return [];
  }
}
