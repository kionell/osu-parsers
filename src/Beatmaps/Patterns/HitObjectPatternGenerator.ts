import { ManiaBeatmap } from '../ManiaBeatmap';
import { PatternGenerator } from './PatternGenerator';
import { PatternType } from '../../Enums/PatternType';
import { Pattern } from './Pattern';
import { Note } from '../../Objects/Note';

import {
  FastRandom,
  Vector2,
  HitSample,
  HitSound,
  IHitObject,
  IHasPosition,
  IBeatmap,
} from 'osu-classes';

export class HitObjectPatternGenerator extends PatternGenerator {
  stairType: PatternType = PatternType.None;

  protected convertType: PatternType = PatternType.None;

  constructor(
    hitObject: IHitObject,
    beatmap: ManiaBeatmap,
    originalBeatmap: IBeatmap,
    previousPattern: Pattern,
    rng: FastRandom,
    previousTime: number,
    previousPosition: Vector2,
    density: number,
    lastStair: PatternType,
  ) {
    super(hitObject, beatmap, originalBeatmap, previousPattern, rng);

    this.stairType = lastStair;

    const timingPoint = beatmap.controlPoints
      .timingPointAt(hitObject.startTime);

    const effectPoint = beatmap.controlPoints
      .effectPointAt(hitObject.startTime);

    const startPosition = (hitObject as unknown as IHasPosition).startPosition;
    const posSeparation = (startPosition || new Vector2(0, 0))
      .fsubtract(previousPosition)
      .flength();

    const timeSeparation = hitObject.startTime - previousTime;

    if (timeSeparation <= 80) {
      // More than 187 BPM
      this.convertType |= PatternType.ForceNotStack | PatternType.KeepSingle;
    }
    else if (timeSeparation <= 95) {
      // More than 157 BPM
      this.convertType |= PatternType.ForceNotStack | PatternType.KeepSingle | lastStair;
    }
    else if (timeSeparation <= 105) {
      // More than 140 BPM
      this.convertType |=
        PatternType.ForceNotStack | PatternType.LowProbability;
    }
    else if (timeSeparation <= 125) {
      // More than 120 BPM
      this.convertType |= PatternType.ForceNotStack;
    }
    else if (timeSeparation <= 135 && posSeparation < 20) {
      // More than 111 BPM stream
      this.convertType |= PatternType.Cycle | PatternType.KeepSingle;
    }
    else if (timeSeparation <= 150 && posSeparation < 20) {
      // More than 100 BPM stream
      this.convertType |= PatternType.ForceStack | PatternType.LowProbability;
    }
    else if (posSeparation < 20 && density >= timingPoint.beatLength / 2.5) {
      // Low density stream
      this.convertType |= PatternType.Reverse | PatternType.LowProbability;
    }
    else if (density < timingPoint.beatLength / 2.5 || effectPoint.kiai) {
      // High density
    }
    else {
      this.convertType |= PatternType.LowProbability;
    }

    if (!(this.convertType & PatternType.KeepSingle)) {
      const isFinish = !!hitObject.samples.find((sample) => {
        return sample.hitSound === HitSound[HitSound.Finish];
      });

      const isClap = !!hitObject.samples.find((sample) => {
        return sample.hitSound === HitSound[HitSound.Clap];
      });

      if (isFinish && this.totalColumns !== 8) {
        this.convertType |= PatternType.Mirror;
      }
      else if (isClap) {
        this.convertType |= PatternType.Gathered;
      }
    }
  }

  *generate(): Generator<Pattern> {
    const p = this._generateCore();

    const isStair = !!(this.convertType & PatternType.Stair);
    const isReverseStair = !!(this.convertType & PatternType.ReverseStair);

    for (const hitObject of p.hitObjects) {
      if (isStair && hitObject.column === this.totalColumns - 1) {
        this.stairType = PatternType.ReverseStair;
      }

      if (isReverseStair && hitObject.column === this.randomStart) {
        this.stairType = PatternType.Stair;
      }
    }

    yield p;
  }

  private _generateCore(): Pattern {
    const pattern = new Pattern();

    if (this.totalColumns === 1) {
      this.addToPattern(pattern, 0);

      return pattern;
    }

    const lastColumn = this.previousPattern.hitObjects.length
      ? this.previousPattern.hitObjects[0].column
      : 0;

    const isReverse = !!(this.convertType & PatternType.Reverse);

    if (isReverse && this.previousPattern.hitObjects.length) {
      /**
       * Generate a new pattern by copying the last
       * hit objects in reverse-column order.
       */
      for (let i = this.randomStart; i < this.totalColumns; ++i) {
        if (this.previousPattern.columnHasObject(i)) {
          const column = this.randomStart + this.totalColumns - i - 1;

          this.addToPattern(pattern, column);
        }
      }

      return pattern;
    }

    const isCycle = !!(this.convertType & PatternType.Cycle);
    const isSingleObject = this.previousPattern.hitObjects.length === 1;

    // If we convert to 7K + 1, let's not overload the special key
    const is7KPlus1 = this.totalColumns !== 8 || lastColumn !== 0;

    // Make sure the last column was not the centre column
    const isNotCenter = this.totalColumns % 2 === 0
      || lastColumn !== this.totalColumns / 2;

    if (isCycle && isSingleObject && is7KPlus1 && isNotCenter) {
      /**
       * Generate a new pattern by cycling backwards
       * (similar to Reverse but for only one hit object)
       */
      const column = this.randomStart + this.totalColumns - lastColumn - 1;

      this.addToPattern(pattern, column);

      return pattern;
    }

    const isForceStack = !!(this.convertType & PatternType.ForceStack);

    if (isForceStack && this.previousPattern.hitObjects.length) {
      // Generate a new pattern by placing on the already filled columns
      for (let i = this.randomStart; i < this.totalColumns; ++i) {
        if (this.previousPattern.columnHasObject(i)) {
          this.addToPattern(pattern, i);
        }
      }

      return pattern;
    }

    if (this.previousPattern.hitObjects.length === 1) {
      if (this.convertType & PatternType.Stair) {
        /**
         * Generate a new pattern by placing on the next column,
         * cycling back to the start if there is no "next"
         */
        let targetColumn = lastColumn + 1;

        if (targetColumn === this.totalColumns) {
          targetColumn = this.randomStart;
        }

        this.addToPattern(pattern, targetColumn);

        return pattern;
      }

      if (this.convertType & PatternType.ReverseStair) {
        /**
         * Generate a new pattern by placing on the previous column,
         * cycling back to the end if there is no "previous"
         */
        let targetColumn = lastColumn - 1;

        if (targetColumn === this.randomStart - 1) {
          targetColumn = this.totalColumns - 1;
        }

        this.addToPattern(pattern, targetColumn);

        return pattern;
      }
    }

    if (this.convertType & PatternType.KeepSingle) {
      return this.generateRandomNotes(1);
    }

    if (this.convertType & PatternType.Mirror) {
      if (this.conversionDifficulty > 6.5) {
        return this.generateRandomPatternWithMirrored(0.12, 0.38, 0.12);
      }

      if (this.conversionDifficulty > 4) {
        return this.generateRandomPatternWithMirrored(0.12, 0.17, 0);
      }

      return this.generateRandomPatternWithMirrored(0.12, 0, 0);
    }

    if (this.conversionDifficulty > 6.5) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateRandomPattern(0.78, 0.42, 0, 0);
      }

      return this.generateRandomPattern(1, 0.62, 0, 0);
    }

    if (this.conversionDifficulty > 4) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateRandomPattern(0.35, 0.08, 0, 0);
      }

      return this.generateRandomPattern(0.52, 0.15, 0, 0);
    }

    if (this.conversionDifficulty > 2) {
      if (this.convertType & PatternType.LowProbability) {
        return this.generateRandomPattern(0.18, 0, 0, 0);
      }

      return this.generateRandomPattern(0.45, 0, 0, 0);
    }

    return this.generateRandomPattern(0, 0, 0, 0);
  }

  /**
   * Generates random notes.
   * This will generate as many as it can up to noteCount,
   * accounting for any stacks if this.convertType is forcing no stacks.
   * @param noteCount The amount of notes to generate.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomNotes(noteCount: number): Pattern {
    const getNextColumn = (last: number) => {
      if (this.convertType & PatternType.Gathered) {
        if (++last === this.totalColumns) {
          last = this.randomStart;
        }
      }
      else {
        last = this.getRandomColumn();
      }

      return last;
    };

    const pattern = new Pattern();

    const allowStacking = !(this.convertType & PatternType.ForceNotStack);

    if (!allowStacking) {
      const count =
        this.totalColumns -
        this.randomStart -
        this.previousPattern.columnsWithObjects;

      noteCount = Math.min(noteCount, count);
    }

    const startX = (this.hitObject as unknown as IHasPosition).startX;
    let column = this.getColumn(startX || 0, true);

    for (let i = 0; i < noteCount; ++i) {
      if (allowStacking) {
        const options = {
          nextColumn: getNextColumn,
          patterns: [pattern],
        };

        column = this.findAvailableColumn(column, options);
      }
      else {
        const options = {
          nextColumn: getNextColumn,
          patterns: [pattern, this.previousPattern],
        };

        column = this.findAvailableColumn(column, options);
      }

      this.addToPattern(pattern, column);
    }

    return pattern;
  }

  /**
   * Whether this hit object can generate a note in the special column.
   */
  protected hasSpecialColumn(): boolean {
    const findClap = (sample: HitSample) =>
      sample.hitSound === HitSound[HitSound.Clap];

    const findFinish = (sample: HitSample) =>
      sample.hitSound === HitSound[HitSound.Finish];

    return (
      !!this.hitObject.samples.find(findClap) &&
      !!this.hitObject.samples.find(findFinish)
    );
  }

  /**
   * Generates a random pattern.
   * @param p2 Probability for 2 notes to be generated.
   * @param p3 Probability for 3 notes to be generated.
   * @param p4 Probability for 4 notes to be generated.
   * @param p5 Probability for 5 notes to be generated.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomPattern(p2: number, p3: number, p4: number, p5: number): Pattern {
    const pattern = new Pattern();

    const noteCount = this.getRandomNoteCount(p2, p3, p4, p5);
    const randomNotes = this.generateRandomNotes(noteCount);

    pattern.addPatternHitObjects(randomNotes);

    if (this.randomStart > 0 && this.hasSpecialColumn()) {
      this.addToPattern(pattern, 0);
    }

    return pattern;
  }

  /**
   * Generates a random pattern which has both normal and mirrored notes.
   * @param centreProbability The probability for a note
   * to be added to the centre column.
   * @param p2 Probability for 2 notes to be generated.
   * @param p3 Probability for 3 notes to be generated.
   * @returns The pattern containing the hit objects.
   */
  protected generateRandomPatternWithMirrored(centreProbability: number, p2: number, p3: number): Pattern {
    if (this.convertType & PatternType.ForceNotStack) {
      return this.generateRandomPattern(1 / Math.fround(2) + p2 / 2, p2, (p2 + p3) / 2, p3);
    }

    const pattern = new Pattern();

    const [noteCount, addToCentre] = this.getRandomNoteCountMirrored(centreProbability, p2, p3);

    const columnLimit = Math.trunc((this.totalColumns % 2 ? this.totalColumns - 1 : this.totalColumns) / 2);

    let column = this.getRandomColumn(this.randomStart, columnLimit);

    const options = {
      upperBound: columnLimit,
      patterns: [pattern],
    };

    for (let i = 0; i < noteCount; ++i) {
      column = this.findAvailableColumn(column, options);

      const mirroredColumn = this.randomStart + this.totalColumns - column - 1;

      // Add normal note
      this.addToPattern(pattern, column);

      // Add mirrored note
      this.addToPattern(pattern, mirroredColumn);
    }

    if (addToCentre) {
      this.addToPattern(pattern, Math.trunc(this.totalColumns / 2));
    }

    if (this.randomStart > 0 && this.hasSpecialColumn()) {
      this.addToPattern(pattern, 0);
    }

    return pattern;
  }

  /**
   * Generates a count of notes to be generated } from a list of probabilities.
   * @param p2 Probability for 2 notes to be generated.
   * @param p3 Probability for 3 notes to be generated.
   * @param p4 Probability for 4 notes to be generated.
   * @param p5 Probability for 5 notes to be generated.
   * @returns The amount of notes to be generated.
   */
  protected getRandomNoteCount(p2: number, p3: number, p4: number, p5: number): number {
    switch (this.totalColumns) {
      case 2:
        p2 = 0;
        p3 = 0;
        p4 = 0;
        p5 = 0;
        break;

      case 3:
        p2 = Math.min(p2, 0.1);
        p3 = 0;
        p4 = 0;
        p5 = 0;
        break;

      case 4:
        p2 = Math.min(p2, 0.23);
        p3 = Math.min(p3, 0.04);
        p4 = 0;
        p5 = 0;
        break;

      case 5:
        p3 = Math.min(p3, 0.15);
        p4 = Math.min(p4, 0.03);
        p5 = 0;
        break;
    }

    const findClap = (sample: HitSample) =>
      sample.hitSound === HitSound[HitSound.Clap];

    if (this.hitObject.samples.find(findClap)) {
      p2 = 1;
    }

    return super.getRandomNoteCount(p2, p3, p4, p5);
  }

  /**
   * Generates a count of notes to be generated } from a list of probabilities.
   * @param centreProbability The probability for a note
   * to be added to the centre column.
   * @param p2 Probability for 2 notes to be generated.
   * @param p3 Probability for 3 notes to be generated.
   * @returns A tuple with the amount of notes to be generated
   * and flag that determines whether to add a note to the centre column.
   * The note to be added to the centre column will NOT be part of this count.
   */
  protected getRandomNoteCountMirrored(centreProbability: number, p2: number, p3: number): [number, boolean] {
    switch (this.totalColumns) {
      case 2:
        centreProbability = 0;
        p2 = 0;
        p3 = 0;
        break;

      case 3:
        centreProbability = Math.min(centreProbability, 0.03);
        p2 = 0;
        p3 = 0;
        break;

      case 4:
        centreProbability = 0;

        /**
         * Stable requires rngValue > x, which is an inverse-probability.
         * osu!lazer uses true probability (1 - x).
         * Multiplying this value by 2 (stable) is not the same
         * operation as dividing it by 2 (lazer),
         * so it needs to be converted to } from a probability
         * and then back after the multiplication.
         */
        p2 = 1 - Math.max((1 - p2) * 2, 0.8);
        p3 = 0;
        break;

      case 5:
        centreProbability = Math.min(centreProbability, 0.03);
        p3 = 0;
        break;

      case 6:
        centreProbability = 0;

        /**
         * Stable requires rngValue > x, which is an inverse-probability.
         * osu!lazer uses true probability (1 - x).
         * Multiplying this value by 2 (stable) is not the same
         * operation as dividing it by 2 (lazer),
         * so it needs to be converted to } from a probability
         * and then back after the multiplication.
         */
        p2 = 1 - Math.max((1 - p2) * 2, 0.5);
        p3 = 1 - Math.max((1 - p3) * 2, 0.85);
        break;
    }

    /**
     * The stable values were allowed to exceed 1,
     * which indicate <0% probability. These values needs to be clamped
     * otherwise this.getRandomNoteCount() will throw an exception.
     */
    p2 = Math.max(0, Math.min(p2, 1));
    p3 = Math.max(0, Math.min(p3, 1));

    const centreVal = this.rng.nextDouble();
    const noteCount = super.getRandomNoteCount(p2, p3);

    const addToCentre = this.totalColumns % 2 === 1
      && noteCount !== 3 && centreVal > 1 - centreProbability;

    return [noteCount, addToCentre];
  }

  /**
   * Constructs and adds a note to a pattern.
   * @param pattern The pattern to add to.
   * @param column The column to add the note to.
   */
  protected addToPattern(pattern: Pattern, column: number): void {
    const note = new Note();
    const posData = this.hitObject as unknown as IHasPosition;

    note.startTime = this.hitObject.startTime;
    note.originalColumn = column;
    note.samples = this.hitObject.samples.map((s) => s.clone());
    note.startPosition = posData?.startPosition?.clone() ?? new Vector2(256, 192);

    pattern.addHitObject(note);
  }
}
