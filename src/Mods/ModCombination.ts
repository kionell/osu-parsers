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
   * @param bitwise The bitwise value.
   * @returns If the mod combination contain any of mods from this bitwise.
   */
  has(bitwise: number): boolean {
    return (this.bitwise & bitwise) > 0 || this.bitwise === bitwise;
  }

  /**
   * Finds all mods that are applicable to the beatmap by bitwise value.
   * @param bitwise The bitwise value.
   * @returns The list of all found mods.
   */
  beatmapModsAt(bitwise: number): IApplicableToBeatmap[] {
    const mods = this.all as IApplicableToBeatmap[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToBeatmap);
  }

  /**
   * Finds a mod that is applicable to the beatmap by bitwise value.
   * @param bitwise The bitwise value.
   * @returns First found mod. Otherwise returns null.
   */
  beatmapModAt(bitwise: number): IApplicableToBeatmap {
    return this.beatmapModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap hit objects by bitwise value.
   * @param bitwise The bitwise value.
   * @returns The list of all found mods.
   */
  hitObjectModsAt(bitwise: number): IApplicableToHitObjects[] {
    const mods = this.all as IApplicableToHitObjects[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToHitObjects);
  }

  /**
   * Finds a mod that is applicable to the beatmap hit objects by bitwise value.
   * @param bitwise The bitwise value.
   * @returns First found mod. Otherwise returns null.
   */
  hitObjectModAt(bitwise: number): IApplicableToHitObjects {
    return this.hitObjectModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap difficulty by bitwise value.
   * @param bitwise The bitwise value.
   * @returns The list of all found mods.
   */
  difficultyModsAt(bitwise: number): IApplicableToDifficulty[] {
    const mods = this.all as IApplicableToDifficulty[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToDifficulty);
  }

  /**
   * Finds a mod that is applicable to the beatmap difficulty by bitwise value.
   * @param bitwise The bitwise value.
   * @returns First found mod. Otherwise returns null.
   */
  difficultyModAt(bitwise: number): IApplicableToDifficulty {
    return this.difficultyModsAt(bitwise)[0] || null;
  }

  /**
   * Finds all mods that are applicable to the beatmap converter by bitwise value.
   * @param bitwise The bitwise value.
   * @returns The list of all found mods.
   */
  converterModsAt(bitwise: number): IApplicableToConverter[] {
    const mods = this.all as IApplicableToConverter[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToConverter);
  }

  /**
   * Finds a mod that is applicable to the beatmap converter by bitwise value.
   * @param bitwise The bitwise value.
   * @returns First found mod. Otherwise returns null.
   */
  converterModAt(bitwise: number): IApplicableToConverter {
    return this.converterModsAt(bitwise)[0] || null;
  }

  /**
   * Finds mods by bitwise value.
   * @param bitwise The bitwise value.
   * @returns The list of all found mods.
   */
  modsAt(bitwise: number): IMod[] {
    return this.all.filter((m) => m.bitwise & bitwise);
  }

  /**
   * Finds a mod by bitwise value.
   * @param bitwise The bitwise value.
   * @returns First found mod. Otherwise returns null.
   */
  modAt(bitwise: number): IMod {
    return this.modsAt(bitwise)[0] || null;
  }
}
