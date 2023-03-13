import { IBeatmapInfo } from './IBeatmapInfo';
import { ModCombination } from '../Mods';
import { IRuleset } from '../Rulesets';
import { IJsonableBeatmapInfo, JsonableBeatmapInfo } from './IJsonableBeatmapInfo';

/**
 * A beatmap information.
 */
export class BeatmapInfo implements IBeatmapInfo {
  /**
   * The beatmap ID.
   */
  id = 0;

  /**
   * ID of beatmapset of this beatmap.
   */
  beatmapsetId = 0;

  /**
   * The beatmap creator ID.
   */
  creatorId = 0;

  /**
   * The beatmap creator username.
   */
  creator = '';

  /**
   * Number of the beatmap favourites.
   */
  favourites = 0;

  /**
   * Number of passes of the beatmap.
   */
  passcount = 0;

  /**
   * Number of playcount of the beatmap.
   */
  playcount = 0;

  /**
   * Rank status of the beatmap (Graveyard, Loved, Ranked...)
   */
  status = -2;

  /**
   * The beatmap title.
   */
  title = 'Unknown title';

  /**
   * The beatmap artist.
   */
  artist = 'Unknown artist';

  /**
   * Difficulty name of the beatmap.
   */
  version = 'Normal';

  /**
   * Number of hittable objects of the beatmap.
   */
  hittable = 0;

  /**
   * Number of slidable objects of the beatmap.
   */
  slidable = 0;

  /**
   * Number of spinnable objects of the beatmap.
   */
  spinnable = 0;

  /**
   * Number of holdable objects of the beatmap.
   */
  holdable = 0;

  /**
   * Length of the beatmap in seconds.
   */
  length = 0;

  /**
   * Minimal BPM of a beatmap.
   */
  bpmMin = 0;

  /**
   * Maximal BPM of a beatmap.
   */
  bpmMax = 0;

  /**
   * The most common BPM of a beatmap.
   */
  bpm = 0;

  /**
   * Circle size of the beatmap.
   */
  circleSize = 0;

  /**
   * Approach rate of the beatmap.
   */
  approachRate = 0;

  /**
   * Overall difficulty of the beatmap.
   */
  overallDifficulty = 0;

  /**
   * HP drain rate of the beatmap.
   */
  drainRate = 0;

  /**
   * Ruleset instance.
   */
  private _ruleset: IRuleset | null = null;

  get ruleset(): IRuleset | null {
    return this._ruleset;
  }

  set ruleset(value: IRuleset | null) {
    this._ruleset = value;
    this._mods = this.ruleset?.createModCombination(this.rawMods) ?? null;
  }

  /**
   * Ruleset ID of this beatmap info.
   */
  private _rulesetId = 0;

  get rulesetId(): number {
    return this.ruleset?.id ?? this._rulesetId;
  }

  set rulesetId(value: number) {
    this._rulesetId = value;
  }

  /**
   * Mods of this beatmap info.
   */
  private _mods: ModCombination | null = null;

  get mods(): ModCombination | null {
    return this._mods;
  }

  set mods(value: ModCombination | null) {
    this._mods = value;
    this._rawMods = value?.bitwise ?? 0;
  }

  /**
   * Raw mods of this beatmap info.
   */
  private _rawMods: string | number = 0;

  get rawMods(): string | number {
    return this._rawMods;
  }

  set rawMods(value: string | number) {
    if (this._rawMods === value) return;

    this._rawMods = value;
    this._mods = this.ruleset?.createModCombination(value) ?? null;
  }

  /**
   * Total star rating of the beatmap.
   */
  starRating = 0;

  /**
   * Max combo of the beatmap.
   */
  maxCombo = 0;

  /**
   * If this beatmap info is for converted beatmap.
   */
  isConvert = false;

  /**
   * The date of the beatmap deletion.
   */
  deletedAt: Date | null = null;

  /**
   * The date of the last beatmap update.
   */
  updatedAt: Date | null = null;

  /**
   * Beatmap MD5 hash.
   */
  hashMD5 = '';

  /**
   * Creates a new instance of a beatmap information.
   * @param options The beatmap information options.
   */
  constructor(options: Partial<IBeatmapInfo> = {}) {
    Object.assign(this, options);
  }

  /**
   * Converts this beatmap information to JSON.
   * @returns Beatmap information convertable to JSON.
   */
  toJSON(): IJsonableBeatmapInfo {
    const partial: Partial<this> = {};
    const deselect = ['beatmap', 'ruleset', 'rawMods', 'mods'];

    for (const key in this) {
      if (key.startsWith('_')) continue;
      if (deselect.includes(key)) continue;

      partial[key] = this[key];
    }

    return {
      ...partial as JsonableBeatmapInfo,
      mods: this.mods?.toString() ?? 'NM',
      rulesetId: this.rulesetId,
      totalHits: this.totalHits,
    };
  }

  /**
   * Creates a new deep copy of a beatmap info.
   * @returns Cloned beatmap info.
   */
  clone(): this {
    const BeatmapInfo = this.constructor as new (params?: Partial<IBeatmapInfo>) => this;

    const cloned = new BeatmapInfo();

    Object.assign(cloned, this);

    return cloned;
  }

  /**
   * @param other Other beatmap info.
   * @returns If two beatmaps are equal.
   */
  equals(other: IBeatmapInfo): boolean {
    if (!other) return false;

    if (this.id !== 0 && other.id !== 0) {
      return this.id === other.id;
    }

    return false;
  }

  /**
   * Beatmap total hits.
   */
  get totalHits(): number {
    return this.hittable + this.slidable + this.spinnable + this.holdable;
  }
}
