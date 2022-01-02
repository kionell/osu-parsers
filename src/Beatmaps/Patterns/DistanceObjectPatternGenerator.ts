import { ManiaBeatmap } from '../ManiaBeatmap';
import { Note } from '../../Objects/Note';
import { Hold } from '../../Objects/Hold';

import { PatternGenerator } from './PatternGenerator';
import { PatternType } from '../../Enums/PatternType';
import { Pattern } from './Pattern';

import {
  FastRandom,
  HitSample,
  HitType,
  HitSound,
  ISlidableObject,
  IHoldableObject,
  IHitObject,
  IHasPosition,
  IBeatmap,
  Vector2,
  RoundHelper,
} from 'osu-classes';

/**
 * A pattern generator for IHasDistance hit objects.
 */
export class DistanceObjectPatternGenerator extends PatternGenerator {
  /**
   * Base osu! slider scoring distance.
   */
  static BASE_SCORING_DISTANCE = 100;

  readonly startTime: number;

  readonly endTime: number;

  readonly segmentDuration: number;

  readonly spanCount: number;

  protected convertType: PatternType = PatternType.None;

  constructor(
    hitObject: IHitObject,
    beatmap: ManiaBeatmap,
    originalBeatmap: IBeatmap,
    previousPattern: Pattern,
    rng: FastRandom,
  ) {
    super(hitObject, beatmap, originalBeatmap, previousPattern, rng);

    if (!beatmap.controlPoints.effectPointAt(hitObject.startTime).kiai) {
      this.convertType = PatternType.LowProbability;
    }

    const slider = hitObject as ISlidableObject;

    const timingPoint = beatmap.controlPoints
      .timingPointAt(hitObject.startTime);

    const difficultyPoint = beatmap.controlPoints.difficultyPointAt(hitObject.startTime);

    const beatLength = timingPoint.beatLength * difficultyPoint.bpmMultiplier;

    this.spanCount = slider.repeats + 1 || 1;
    this.startTime = RoundHelper.round(hitObject.startTime);

    const sliderMultiplier = beatmap.difficulty.sliderMultiplier;

    // This matches stable's calculation.
    this.endTime = ((slider.path.distance || 0) * beatLength * this.spanCount * 0.01) / sliderMultiplier;

    this.endTime = Math.trunc(Math.floor(this.startTime + this.endTime));

    const duration = this.endTime - this.startTime;

    this.segmentDuration = (duration / this.spanCount) >> 0;
  }

  *generate(): Generator<Pattern> {
    const originalPattern = this.generatePattern();

    if (originalPattern.hitObjects.length === 1) {
      return yield originalPattern;
    }

    /**
     * We need to split the intermediate pattern into two new patterns:
     * 1. A pattern containing all objects that do not end at our endTime.
     * 2. A pattern containing all objects that end at our endTime.
     *    This will be used for further pattern generation.
     */
    const intermediatePattern = new Pattern();
    const endTimePattern = new Pattern();

    for (const hitObject of originalPattern.hitObjects) {
      let endTime = (hitObject as IHitObject as IHoldableObject).endTime;

      endTime = endTime || hitObject.startTime;

      if (this.endTime !== RoundHelper.round(endTime)) {
        intermediatePattern.addHitObject(hitObject);
      }
      else {
        endTimePattern.addHitObject(hitObject);
      }
    }

    yield intermediatePattern;
    yield endTimePattern;
  }

  protected generatePattern(): Pattern {
    if (this.totalColumns === 1) {
      const pattern = new Pattern();

      this.addToPattern(pattern, 0, this.startTime, this.endTime);

      return pattern;
    }

    if (this.spanCount > 1) {
      if (this.segmentDuration <= 90) {
        return this.generateRandomHoldNotes(this.startTime, 1);
      }

      if (this.segmentDuration <= 120) {
        this.convertType |= PatternType.ForceNotStack;

        return this.generateRandomNotes(this.startTime, this.spanCount + 1);
      }

      if (this.segmentDuration <= 160) {
        return this.generateStair(this.startTime);
      }

      if (this.segmentDuration <= 200 && this.conversionDifficulty > 3) {
        return this.generateRandomMultipleNotes(this.startTime);
      }

      if (this.endTime - this.startTime >= 4000) {
        return this.generateNRandomNotes(this.startTime, 0.23, 0, 0);
      }

      const columns = this.totalColumns - 1 - this.randomStart;

      if (this.segmentDuration > 400 && this.spanCount < columns) {
        return this.generateTiledHoldNotes(this.startTime);
      }

      return this.generateHoldAndNormalNotes(this.startTime);
    }

    if (this.segmentDuration <= 110) {
      if (this.previousPattern.columnsWithObjects < this.totalColumns) {
        this.convertType |= PatternType.ForceNotStack;
      }
      else {
        this.convertType &= ~PatternType.ForceNotStack;
      }

      const noteCount = this.segmentDuration < 80 ? 1 : 2;

      return this.generateRandomNotes(this.startTime, noteCount);
    }

    if (this.conversionDifficulty > 6.5) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateNRandomNotes(this.startTime, 0.78, 0.3, 0);
      }

      return this.generateNRandomNotes(this.startTime, 0.85, 0.36, 0.03);
    }

    if (this.conversionDifficulty > 4) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateNRandomNotes(this.startTime, 0.43, 0.08, 0);
      }

      return this.generateNRandomNotes(this.startTime, 0.56, 0.18, 0);
    }

    if (this.conversionDifficulty > 2.5) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateNRandomNotes(this.startTime, 0.3, 0, 0);
      }

      return this.generateNRandomNotes(this.startTime, 0.37, 0.08, 0);
    }

    if (this.convertType & PatternType.LowProbability) {
      return this.generateNRandomNotes(this.startTime, 0.17, 0, 0);
    }

    return this.generateNRandomNotes(this.startTime, 0.27, 0, 0);
  }

  /**
   * Generates random hold notes that start at an span the same amount of rows.
   * @param startTime Start time of each hold note.
   * @param noteCount Number of hold notes.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomHoldNotes(startTime: number, noteCount: number): Pattern {
    /**
     * - - - -
     * ■ - ■ ■
     * □ - □ □
     * ■ - ■ ■
     */

    const pattern = new Pattern();

    const usableColumns =
      this.totalColumns -
      this.randomStart -
      this.previousPattern.columnsWithObjects;

    let column = this.getRandomColumn();

    for (let i = 0, len = Math.min(usableColumns, noteCount); i < len; ++i) {
      const options = {
        patterns: [pattern, this.previousPattern],
      };

      // Find available column
      column = this.findAvailableColumn(column, options);

      this.addToPattern(pattern, column, startTime, this.endTime);
    }

    // This is can't be combined with the above loop due to RNG
    for (let i = 0, len = noteCount - usableColumns; i < len; ++i) {
      const options = {
        patterns: [pattern],
      };

      column = this.findAvailableColumn(column, options);

      this.addToPattern(pattern, column, startTime, this.endTime);
    }

    return pattern;
  }

  /**
   * Generates random notes, with one note per row and no stacking.
   * @param startTime The start time.
   * @param noteCount The number of notes.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomNotes(startTime: number, noteCount: number): Pattern {
    /**
     * - - - -
     * x - - -
     * - - x -
     * - - - x
     * x - - -
     */

    const pattern = new Pattern();

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let column = this.getColumn(startX || 0, true);

    const isForceNotStack = !!(this.convertType & PatternType.ForceNotStack);

    const lessThanTotalColumns =
      this.previousPattern.columnsWithObjects < this.totalColumns;

    if (isForceNotStack && lessThanTotalColumns) {
      const options = {
        patterns: [this.previousPattern],
      };

      column = this.findAvailableColumn(column, options);
    }

    let lastColumn = column;

    for (let i = 0; i < noteCount; ++i) {
      this.addToPattern(pattern, column, startTime, startTime);

      const options = {
        validate: (c: number) => c !== lastColumn,
      };

      startTime += this.segmentDuration;

      column = this.findAvailableColumn(column, options);
      lastColumn = column;
    }

    return pattern;
  }

  /**
   * Generates a stair of notes, with one note per row.
   * @param startTime The start time.
   * @returns The pattern containing the hit objects.
   */
  protected generateStair(startTime: number): Pattern {
    /**
     * - - - -
     * x - - -
     * - x - -
     * - - x -
     * - - - x
     * - - x -
     * - x - -
     * x - - -
     */

    const pattern = new Pattern();

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let column = this.getColumn(startX || 0, true);

    let increasing = this.rng.nextDouble() > 0.5;

    for (let i = 0; i <= this.spanCount; ++i) {
      this.addToPattern(pattern, column, startTime, startTime);

      startTime += this.segmentDuration;

      /**
       * Check if we're at the borders of the stage,
       * and invert the pattern if so
       */
      if (increasing) {
        if (column >= this.totalColumns - 1) {
          increasing = false;
          --column;
        }
        else {
          ++column;
        }
      }
      else {
        if (column <= this.randomStart) {
          increasing = true;
          ++column;
        }
        else {
          --column;
        }
      }
    }

    return pattern;
  }

  /**
   * Generates random notes with 1-2 notes per row and no stacking.
   * @param startTime The start time.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomMultipleNotes(startTime: number): Pattern {
    /**
     * - - - -
     * x - - -
     * - x x -
     * - - - x
     * x - x -
     */

    const pattern = new Pattern();

    const legacy = this.totalColumns >= 4 && this.totalColumns <= 8;

    const interval = this.rng.nextInt(1, this.totalColumns - (legacy ? 1 : 0));

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let column = this.getColumn(startX || 0, true);

    for (let i = 0; i <= this.spanCount; ++i) {
      this.addToPattern(pattern, column, startTime, startTime);

      column += interval;

      if (column >= this.totalColumns - this.randomStart) {
        column =
          column - this.totalColumns - this.randomStart + (legacy ? 1 : 0);
      }

      column += this.randomStart;

      // If we're in 2K, let's not add many consecutive doubles
      if (this.totalColumns > 2) {
        this.addToPattern(pattern, column, startTime, startTime);
      }

      column = this.getRandomColumn();
      startTime += this.segmentDuration;
    }

    return pattern;
  }

  /**
   * Generates random hold notes. The amount of hold notes generated is determined by probabilities.
   * @param startTime The hold note start time.
   * @param p2 The probability required for 2 hold notes to be generated.
   * @param p3 The probability required for 3 hold notes to be generated.
   * @param p4 The probability required for 4 hold notes to be generated.
   * @returns The pattern containing the hit objects.
   */
  protected generateNRandomNotes(startTime: number,
    p2: number,
    p3: number,
    p4: number): Pattern {
    /**
     * - - - -
     * ■ - ■ ■
     * □ - □ □
     * ■ - ■ ■
     */

    switch (this.totalColumns) {
      case 2:
        p2 = 0;
        p3 = 0;
        p4 = 0;
        break;

      case 3:
        p2 = Math.min(p2, 0.1);
        p3 = 0;
        p4 = 0;
        break;

      case 4:
        p2 = Math.min(p2, 0.3);
        p3 = Math.min(p3, 0.04);
        p4 = 0;
        break;

      case 5:
        p2 = Math.min(p2, 0.34);
        p3 = Math.min(p3, 0.1);
        p4 = Math.min(p4, 0.03);
        break;
    }

    const isDoubleAtObject = !!this.hitObject.samples.find(findDoubleSample);

    const isDoubleAtTime = !!this.hitSamplesAt(this.startTime).find(findDoubleSample);

    const isLowProbability = this.convertType & PatternType.LowProbability;

    const canGenerateTwoNotes =
      !isLowProbability && (isDoubleAtObject || isDoubleAtTime);

    if (canGenerateTwoNotes) p2 = 1;

    const notes = this.getRandomNoteCount(p2, p3, p4);

    return this.generateRandomHoldNotes(startTime, notes);

    function findDoubleSample(sample: HitSample) {
      return (
        sample.hitSound === HitSound[HitSound.Clap] ||
        sample.hitSound === HitSound[HitSound.Finish]
      );
    }
  }

  /**
   * Generates tiled hold notes. You can think of this as a stair of hold notes.
   * @param startTime The first hold note start time.
   * @returns The pattern containing the hit objects.
   */
  protected generateTiledHoldNotes(startTime: number): Pattern {
    /**
     * - - - -
     * ■ ■ ■ ■
     * □ □ □ □
     * □ □ □ □
     * □ □ □ ■
     * □ □ ■ -
     * □ ■ - -
     * ■ - - -
     */

    const pattern = new Pattern();

    const columnRepeat = Math.min(this.spanCount, this.totalColumns);

    /**
     * Due to integer rounding, this is not guaranteed
     * to be the same as endTime (the class-level variable).
     */
    const endTime = startTime + this.segmentDuration * this.spanCount;

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let column = this.getColumn(startX || 0, true);

    const isForceNotStack = !!(this.convertType & PatternType.ForceNotStack);

    const lessThanTotalColumns =
      this.previousPattern.columnsWithObjects < this.totalColumns;

    if (isForceNotStack && lessThanTotalColumns) {
      const options = {
        patterns: [this.previousPattern],
      };

      column = this.findAvailableColumn(column, options);
    }

    for (let i = 0; i < columnRepeat; ++i) {
      const options = {
        patterns: [pattern],
      };

      column = this.findAvailableColumn(column, options);

      this.addToPattern(pattern, column, startTime, endTime);

      startTime += this.segmentDuration;
    }

    return pattern;
  }

  /**
   * Generates a hold note alongside normal notes.
   * @param startTime The start time of notes.
   * @returns The pattern containing the hit objects.
   */
  protected generateHoldAndNormalNotes(startTime: number): Pattern {
    /**
     * - - - -
     * ■ x x -
     * ■ - x x
     * ■ x - x
     * ■ - x x
     */

    const pattern = new Pattern();

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let holdColumn = this.getColumn(startX || 0, true);

    const isForceNotStack = !!(this.convertType & PatternType.ForceNotStack);

    const lessThanTotalColumns =
      this.previousPattern.columnsWithObjects < this.totalColumns;

    if (isForceNotStack && lessThanTotalColumns) {
      const options = {
        patterns: [this.previousPattern],
      };

      holdColumn = this.findAvailableColumn(holdColumn, options);
    }

    // Create the hold note
    this.addToPattern(pattern, holdColumn, startTime, this.endTime);

    let column = this.getRandomColumn();

    let noteCount = 0;

    if (this.conversionDifficulty > 6.5) {
      noteCount = this.getRandomNoteCount(0.63, 0);
    }
    else if (this.conversionDifficulty > 4) {
      const p2 = this.totalColumns < 6 ? 0.12 : 0.45;

      noteCount = this.getRandomNoteCount(p2, 0);
    }
    else if (this.conversionDifficulty > 2.5) {
      const p2 = this.totalColumns < 6 ? 0 : 0.24;

      noteCount = this.getRandomNoteCount(p2, 0);
    }

    noteCount = Math.min(this.totalColumns - 1, noteCount);

    const ignoreHead = !this.hitSamplesAt(startTime).find((sample) => {
      return (
        sample.hitSound === HitSound[HitSound.Whistle] ||
        sample.hitSound === HitSound[HitSound.Finish] ||
        sample.hitSound === HitSound[HitSound.Clap]
      );
    });

    const rowPattern = new Pattern();

    for (let i = 0; i <= this.spanCount; ++i) {
      if (!(ignoreHead && startTime === this.startTime)) {
        for (let j = 0; j < noteCount; ++j) {
          const options = {
            validate: (c: number) => c !== holdColumn,
            patterns: [rowPattern],
          };

          column = this.findAvailableColumn(column, options);

          this.addToPattern(rowPattern, column, startTime, startTime);
        }
      }

      pattern.addPatternHitObjects(rowPattern);

      rowPattern.clear();

      startTime += this.segmentDuration;
    }

    return pattern;
  }

  /**
   * Retrieves the list of hit samples that occur
   * at time greater than or equal to specified time.
   * @param time The time to retrieve the hit sample list } from.
   * @returns The hit sample list at specified time.
   */
  protected hitSamplesAt(time: number): HitSample[] {
    const nodeSamples = this.nodeSamplesAt(time);

    return nodeSamples[0] || this.hitObject.samples;
  }

  /**
   * Retrieves the list of node samples that occur
   * at time greater than or equal to specified time.
   * @param time The time to retrieve node samples at.
   * @returns The node sample list at specified time.
   */
  protected nodeSamplesAt(time: number): HitSample[][] {
    if (!(this.hitObject.hitType & HitType.Slider)) {
      return [];
    }

    const slider = this.hitObject as ISlidableObject;

    let index = 0;

    if (this.segmentDuration) {
      index = (time - this.startTime) / this.segmentDuration;
    }

    // Avoid slicing the list & creating copies, if at all possible.
    return index ? slider.nodeSamples.slice(index) : slider.nodeSamples;
  }

  /**
   * Constructs and adds a note to a pattern.
   * @param pattern The pattern to add to.
   * @param column The column to add the note to.
   * @param startTime The start time of the note.
   * @param endTime The end time of the note
   * (set to startTime for a non-hold note).
   */
  protected addToPattern(pattern: Pattern,
    column: number,
    startTime: number,
    endTime: number): void {
    if (startTime === endTime) {
      const note = new Note();
      const posData = this.hitObject as unknown as IHasPosition;

      note.startTime = startTime;
      note.originalColumn = column;
      note.hitType = HitType.Normal | (this.hitObject.hitType & HitType.NewCombo);
      note.samples = this.hitSamplesAt(startTime);
      note.startPosition = posData?.startPosition?.clone() ?? new Vector2(256, 192);

      pattern.addHitObject(note);
    }
    else {
      const hold = new Hold();
      const posData = this.hitObject as unknown as IHasPosition;

      hold.startTime = startTime;
      hold.endTime = endTime;
      hold.originalColumn = column;
      hold.hitType = HitType.Hold | (this.hitObject.hitType & HitType.NewCombo);
      hold.samples = this.hitSamplesAt(startTime);
      hold.nodeSamples = this.nodeSamplesAt(startTime);
      hold.startPosition = posData?.startPosition?.clone() ?? new Vector2(256, 192);

      pattern.addHitObject(hold);
    }
  }
}
