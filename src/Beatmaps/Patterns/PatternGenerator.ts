import { FastRandom, IBeatmap, IHitObject } from 'osu-resources';
import { ManiaBeatmap } from '../ManiaBeatmap';
import { Pattern } from './Pattern';

interface IFindOptions {
  /**
   * A list of patterns for which the validity of a column
   * should be checked against. A column is not a valid candidate
   * if a hit object occupies the same column in any of the patterns.
   */
  patterns?: Pattern[];

  /**
   * The minimum column index.
   */
  lowerBound?: number;

  /**
   * The maximum column index.
   */
  upperBound?: number;

  /**
   * A function to retrieve the next column.
   * A randomisation scheme will be used by default.
   */
  nextColumn?: (column: number) => number;

  /**
   * A function to perform additional validation checks to determine
   * if a column is a valid candidate for a hit object.
   */
  validate?: (column: number) => boolean;
}

/**
 * Generator to create a pattern } from a hit object.
 */
export abstract class PatternGenerator {
  /**
   * The last pattern.
   */
  protected readonly previousPattern: Pattern;

  /**
   * The hit object to create the pattern for.
   */
  protected readonly hitObject: IHitObject;

  /**
   * The beatmap which hit object is a part of.
   */
  protected readonly beatmap: ManiaBeatmap;

  /**
   * The original beatmap.
   */
  protected readonly originalBeatmap: IBeatmap;

  protected readonly totalColumns: number;

  /**
   * The column index at which to start generating random notes.
   */
  protected readonly randomStart: number;

  protected readonly rng: FastRandom;

  constructor(
    hitObject: IHitObject,
    beatmap: ManiaBeatmap,
    originalBeatmap: IBeatmap,
    previousPattern: Pattern,
    rng: FastRandom,
  ) {
    this.hitObject = hitObject;
    this.beatmap = beatmap;
    this.originalBeatmap = originalBeatmap;
    this.previousPattern = previousPattern;

    this.totalColumns = beatmap.totalColumns;
    this.randomStart = beatmap.totalColumns === 8 ? 1 : 0;

    this.rng = rng;
  }

  /**
   * Converts an x-position into a column.
   * @param position The x-position.
   * @param allowSpecial Whether to treat as 7K + 1.
   * @returns The column.
   */
  protected getColumn(position: number, allowSpecial = false): number {
    if (allowSpecial && this.totalColumns === 8) {
      const divisor = Math.round(512 / 7 * 100000) / 100000;
      const x = Math.floor(position / divisor);

      return Math.max(0, Math.min(x, 6)) + 1;
    }

    const divisor = Math.round(512 / this.totalColumns * 100000) / 100000;
    const x = Math.floor(position / divisor);

    return Math.max(0, Math.min(x, this.totalColumns - 1));
  }

  /**
   * Generates a count of notes to be generated } from probabilities.
   * @param p2 Probability for 2 notes to be generated.
   * @param p3 Probability for 3 notes to be generated.
   * @param p4 Probability for 4 notes to be generated.
   * @param p5 Probability for 5 notes to be generated.
   * @param p6 Probability for 6 notes to be generated.
   * @returns The amount of notes to be generated.
   */
  protected getRandomNoteCount(
    p2: number,
    p3: number,
    p4 = 0,
    p5 = 0,
    p6 = 0,
  ): number {
    if (p2 < 0 || p2 > 1) {
      throw new Error('p2 is not in range 0-1');
    }

    if (p3 < 0 || p3 > 1) {
      throw new Error('p3 is not in range 0-1');
    }

    if (p4 < 0 || p4 > 1) {
      throw new Error('p4 is not in range 0-1');
    }

    if (p5 < 0 || p5 > 1) {
      throw new Error('p5 is not in range 0-1');
    }

    if (p6 < 0 || p6 > 1) {
      throw new Error('p6 is not in range 0-1');
    }

    const value = this.rng.nextDouble();

    if (value >= 1 - p6) return 6;
    if (value >= 1 - p5) return 5;
    if (value >= 1 - p4) return 4;
    if (value >= 1 - p3) return 3;

    return value >= 1 - p2 ? 2 : 1;
  }

  private _conversionDiff: number | null = null;

  /**
   * A difficulty factor used for various conversion methods } from osu!stable.
   */
  get conversionDifficulty(): number {
    if (this._conversionDiff !== null) {
      return this._conversionDiff;
    }

    const hitObjects = this.originalBeatmap.hitObjects;

    const firstObject = hitObjects[0];
    const lastObject = hitObjects[hitObjects.length - 1];

    const firstStartTime = firstObject.startTime || 0;
    const lastStartTime = lastObject.startTime || 0;

    const drain = lastStartTime - firstStartTime - this.originalBeatmap.totalBreakTime;

    // Drain time in seconds
    let drainTime = Math.trunc(drain / 1000);

    if (drainTime === 0) drainTime = 10000;

    const difficulty = this.originalBeatmap.difficulty;

    this._conversionDiff = Math.max(4, Math.min(difficulty.approachRate, 7));
    this._conversionDiff += difficulty.drainRate;
    this._conversionDiff /= 1.5;
    this._conversionDiff += (hitObjects.length / drainTime) * Math.fround(9);
    this._conversionDiff = Math.fround((this._conversionDiff / 38) * 5) / 1.15;
    this._conversionDiff = Math.min(this._conversionDiff, 12);

    return this._conversionDiff;
  }

  /**
   * Finds a new column in which a hit object can be placed.
   * @param column The initial column to test.
   * This may be returned if it is already a valid column.
   * @param options Options for finding column.
   * @returns A column which has passed the validation check and for which
   * there are no hit objects in any of patterns occupying the same column.
   */
  protected findAvailableColumn(
    column: number,
    options: IFindOptions,
  ): number {
    const patterns = options.patterns || [];
    const lowerBound = options.lowerBound || this.randomStart;
    const upperBound = options.upperBound || this.totalColumns;

    const nextColumn = options.nextColumn || (() => {
      return this.getRandomColumn(lowerBound, upperBound);
    });

    const validate = options.validate || (() => true);

    const isValid = (c: number): boolean => {
      return validate(c) !== false
        && !patterns.find((p) => p.columnHasObject(c));
    };

    // Check for the initial column
    if (isValid(column)) return column;

    /**
     * Ensure that we have at least one free column,
     * so that an endless loop is avoided.
     */
    let hasValidColumns = false;

    for (let i = lowerBound; i < upperBound; ++i) {
      hasValidColumns = isValid(i);

      if (hasValidColumns) break;
    }

    if (!hasValidColumns) {
      throw new Error('There were not enough columns to complete conversion.');
    }

    /**
     * Iterate until a valid column is found.
     * This is a random iteration in the default case.
     */
    do {
      column = nextColumn(column);
    }
    while (!isValid(column));

    return column;
  }

  /**
   * Returns a random column index in the range [lowerBound, upperBound).
   * @param lowerBound The minimum column index.
   * @param upperBound The maximum column index.
   */
  protected getRandomColumn(lowerBound?: number, upperBound?: number): number {
    lowerBound = lowerBound || this.randomStart;
    upperBound = upperBound || this.totalColumns;

    return this.rng.nextInt(lowerBound, upperBound);
  }

  /**
   * Generates the patterns for a hit object, each filled with hit objects.
   * @returns The pattern containing the hit objects.
   */
  abstract generate(): Generator<Pattern>;
}
