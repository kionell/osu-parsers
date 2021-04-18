import { IMod } from './IMod';

import { IApplicableToBeatmap } from './Types/IApplicableToBeatmap';
import { IApplicableToHitObjects } from './Types/IApplicableToHitObjects';
import { IApplicableToDifficulty } from './Types/IApplicableToDifficulty';
import { IApplicableToConverter } from './Types/IApplicableToConverter';

export abstract class ModCombination {
  readonly all: IMod[] = [];

  get beatmapMods(): IApplicableToBeatmap[] {
    const mods = this.all as IApplicableToBeatmap[];

    return mods.filter((m) => m.applyToBeatmap);
  }

  get hitObjectMods(): IApplicableToHitObjects[] {
    const mods = this.all as IApplicableToHitObjects[];

    return mods.filter((m) => m.applyToHitObjects);
  }

  get difficultyMods(): IApplicableToDifficulty[] {
    const mods = this.all as IApplicableToDifficulty[];

    return mods.filter((m) => m.applyToDifficulty);
  }

  get converterMods(): IApplicableToConverter[] {
    const mods = this.all as IApplicableToConverter[];

    return mods.filter((m) => m.applyToConverter);
  }

  get names(): string[] {
    return this.all.map((m) => m.name);
  }

  get acronyms(): string[] {
    return this.all.map((m) => m.acronym);
  }

  get bitwise(): number {
    return this.all.reduce((b, m) => b | m.bitwise, 0);
  }

  get multiplier(): number {
    return this.all.reduce((mp, m) => mp * m.multiplier, 1);
  }

  get isRanked(): boolean {
    return this.all.reduce((r: boolean, m) => r && m.isRanked, true);
  }

  get incompatibles(): number {
    return this.all.reduce((b, m) => b | m.incompatibles, 0);
  }

  has(bitwise: number): boolean {
    return (this.bitwise & bitwise) > 0 || this.bitwise === bitwise;
  }

  beatmapModsAt(bitwise: number): IApplicableToBeatmap[] {
    const mods = this.all as IApplicableToBeatmap[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToBeatmap);
  }

  beatmapModAt(bitwise: number): IApplicableToBeatmap {
    return this.beatmapModsAt(bitwise)[0] || null;
  }

  hitObjectModsAt(bitwise: number): IApplicableToHitObjects[] {
    const mods = this.all as IApplicableToHitObjects[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToHitObjects);
  }

  hitObjectModAt(bitwise: number): IApplicableToHitObjects {
    return this.hitObjectModsAt(bitwise)[0] || null;
  }

  difficultyModsAt(bitwise: number): IApplicableToDifficulty[] {
    const mods = this.all as IApplicableToDifficulty[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToDifficulty);
  }

  difficultyModAt(bitwise: number): IApplicableToDifficulty {
    return this.difficultyModsAt(bitwise)[0] || null;
  }

  converterModsAt(bitwise: number): IApplicableToConverter[] {
    const mods = this.all as IApplicableToConverter[];

    return mods.filter((m) => m.bitwise & bitwise && m.applyToConverter);
  }

  converterModAt(bitwise: number): IApplicableToConverter {
    return this.converterModsAt(bitwise)[0] || null;
  }

  modsAt(bitwise: number): IMod[] {
    return this.all.filter((m) => m.bitwise & bitwise);
  }

  modAt(bitwise: number): IMod {
    return this.modsAt(bitwise)[0] || null;
  }
}
