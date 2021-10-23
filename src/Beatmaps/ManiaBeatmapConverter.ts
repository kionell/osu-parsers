import { DistanceObjectPatternGenerator } from './Patterns/DistanceObjectPatternGenerator';
import { EndTimeObjectPatternGenerator } from './Patterns/EndTimeObjectPatternGenerator';
import { HitObjectPatternGenerator } from './Patterns/HitObjectPatternGenerator';
import { SpecificBeatmapPatternGenerator } from './Patterns/SpecificBeatmapPatternGenerator';
import { PatternGenerator } from './Patterns/PatternGenerator';
import { PatternType } from '../Enums/PatternType';
import { Pattern } from './Patterns/Pattern';
import { ManiaBeatmap } from './ManiaBeatmap';
import { ManiaHitObject } from '../Objects/ManiaHitObject';
import { StageDefinition } from './StageDefinition';

import {
  Vector2,
  FastRandom,
  BeatmapConverter,
  IBeatmap,
  IHasPath,
  IHasPosition,
  IHasDuration,
  ISpinnableObject,
  IHasX,
  Beatmap,
} from 'osu-resources';

export class ManiaBeatmapConverter extends BeatmapConverter {
  /**
   * Maximum number of previous notes to consider for density calculation.
   */
  static MAX_NOTES_FOR_DENSITY = 7;

  /**
   * The maximum number of supported keys in a single stage.
   */
  static MAX_STAGE_KEYS = 10;

  originalRuleset = 3;

  originalTargetColumns = 0;

  targetColumns = 0;

  isDual = false;

  private _rng: FastRandom | null = null;

  private _prevNoteTimes: number[] = [];

  private _density: number = FastRandom.MAX_INT32;

  private _lastTime = 0;

  private _lastPosition: Vector2 = new Vector2(0, 0);

  private _lastPattern: Pattern = new Pattern();

  private _lastStair: PatternType = PatternType.Stair;

  canConvert(beatmap: IBeatmap): boolean {
    return beatmap.hitObjects.every((h) => {
      return Number.isFinite((h as unknown as IHasX).startX);
    });
  }

  convertBeatmap(original: IBeatmap): ManiaBeatmap {
    this.originalRuleset = original.mode;

    this._updateTargetColumns(original);

    let difficulty = original.difficulty;

    let seed = Math.trunc(Math.round(difficulty.approachRate));

    seed += Math.round(difficulty.drainRate + difficulty.circleSize) * 20;
    seed += Math.trunc(difficulty.overallDifficulty * 41.2);

    this._rng = new FastRandom(Math.trunc(seed));

    const converted = this.createBeatmap(original);

    for (const hitObject of this.convertHitObjects(converted)) {
      converted.hitObjects.push(hitObject);
    }

    converted.hitObjects.forEach((h) => (h.originalColumn = h.column));
    converted.hitObjects.sort((a, b) => a.startTime - b.startTime);

    const base = (converted as Beatmap).base;

    difficulty = base ? base.difficulty : converted.difficulty;

    /**
     * Since all conveted beatmaps receive osu!mania ruleset ID,
     * the calculation of the columns will be done differently.
     * We need to update CS to keep the correct number of columns in game.
     */
    difficulty.circleSize = converted.totalColumns;

    return converted;
  }

  *convertHitObjects(beatmap: ManiaBeatmap): Generator<ManiaHitObject> {
    const hitObjects = this.originalRuleset === 3
      ? this._generateSpecific(beatmap)
      : this._generateConverted(beatmap);

    for (const hitObject of hitObjects) {
      yield hitObject;
    }
  }

  createBeatmap(original: IBeatmap): ManiaBeatmap {
    const stage = new StageDefinition();

    stage.columns = this.targetColumns;

    const beatmap = new ManiaBeatmap(original, stage, this.originalTargetColumns);

    if (this.isDual) {
      const dualStage = new StageDefinition();

      dualStage.columns = this.targetColumns;

      beatmap.stages.push(dualStage);
    }

    return beatmap;
  }

  private _updateTargetColumns(original: IBeatmap): void {
    const difficulty = original.difficulty;
    const hitObjects = original.hitObjects;

    const roundedCS = Math.round(difficulty.circleSize);
    const roundedOD = Math.round(difficulty.overallDifficulty);

    if (this.targetColumns) {
      if (!this.originalTargetColumns) {
        this.originalTargetColumns = this.targetColumns;
      }

      return;
    }

    if (this.originalRuleset === 3) {
      this.targetColumns = Math.trunc(Math.max(1, roundedCS));

      if (this.targetColumns > ManiaBeatmapConverter.MAX_STAGE_KEYS) {
        this.targetColumns /= 2;
        this.isDual = true;
      }
    }
    else {
      const pathObjects = hitObjects as unknown[] as IHasPath[];
      const objectsWithDuration = pathObjects.filter((h) => h.endTime || h.path);

      const percentage = objectsWithDuration.length / hitObjects.length;

      if (percentage < 0.2) {
        this.targetColumns = 7;
      }
      else if (percentage < 0.3 || roundedCS >= 5) {
        this.targetColumns = roundedOD > 5 ? 7 : 6;
      }
      else if (percentage > 0.6) {
        this.targetColumns = roundedOD > 4 ? 5 : 4;
      }
      else {
        this.targetColumns = Math.max(4, Math.min(roundedOD + 1, 7));
      }
    }

    this.originalTargetColumns = this.targetColumns;
  }

  private _computeDensity(newNoteTime: number): void {
    const maxNotesForDensity = ManiaBeatmapConverter.MAX_NOTES_FOR_DENSITY;

    if (this._prevNoteTimes.length === maxNotesForDensity) {
      this._prevNoteTimes.shift();
    }

    this._prevNoteTimes.push(newNoteTime);

    if (this._prevNoteTimes.length >= 2) {
      this._density =
        (newNoteTime - this._prevNoteTimes[0]) / this._prevNoteTimes.length;
    }
  }

  private _recordNote(time: number, position: Vector2): void {
    this._lastTime = time;
    this._lastPosition = position;
  }

  /**
   * Method that generates hit objects for osu!mania specific beatmaps.
   * @param beatmap The osu!mania beatmap.
   * This is used to look-up any values dependent on a fully-loaded beatmap.
   * @returns The hit objects generated.
   */
  private *_generateSpecific(beatmap: ManiaBeatmap): Generator<ManiaHitObject> {
    const random = this._rng as FastRandom;
    const hitObjects = beatmap.base.hitObjects;

    for (const hitObject of hitObjects) {
      const cloned = hitObject.clone();
      const pattern = this._lastPattern;

      const generator = new SpecificBeatmapPatternGenerator(
        cloned,
        beatmap,
        pattern,
        random
      );

      for (const generated of generator.generate()) {
        this._lastPattern = generated;

        for (const obj of generated.hitObjects) {
          yield obj;
        }
      }
    }
  }

  /**
   * Method that generates hit objects for non-osu!mania beatmaps.
   * @param beatmap The osu!mania beatmap.
   * This is used to look-up any values dependent on a fully-loaded beatmap.
   * @returns The hit objects generated.
   */
  private *_generateConverted(beatmap: ManiaBeatmap): Generator<ManiaHitObject> {
    const random = this._rng as FastRandom;
    const hitObjects = beatmap.base.hitObjects;

    for (const hitObject of hitObjects) {
      const cloned = hitObject.clone();
      const pattern = this._lastPattern;

      let conversion: PatternGenerator | null = null;

      if ((cloned as unknown as IHasPath).path) {
        const generator = new DistanceObjectPatternGenerator(
          cloned,
          beatmap,
          pattern,
          random
        );

        const position = (cloned as unknown as IHasPosition).startPosition;

        for (let i = 0; i <= generator.spanCount; ++i) {
          const time = cloned.startTime + generator.segmentDuration * i;

          this._recordNote(time, position || new Vector2(0, 0));
          this._computeDensity(time);
        }

        conversion = generator;
      }
      else if ((cloned as unknown as IHasDuration).endTime) {
        const generator = new EndTimeObjectPatternGenerator(
          cloned,
          beatmap,
          pattern,
          random
        );

        const spinner = cloned as ISpinnableObject;

        this._recordNote(spinner.endTime, new Vector2(256, 192));
        this._computeDensity(spinner.endTime);

        conversion = generator;
      }
      else if ((cloned as unknown as IHasPosition).startPosition) {
        this._computeDensity(cloned.startTime);

        const lastTime = this._lastTime as number;
        const lastPosition = this._lastPosition;
        const density = this._density;
        const lastStair = this._lastStair;

        const generator = new HitObjectPatternGenerator(
          cloned,
          beatmap,
          pattern,
          random,
          lastTime,
          lastPosition,
          density,
          lastStair
        );

        const position = (cloned as unknown as IHasPosition).startPosition;

        this._recordNote(cloned.startTime, position);

        conversion = generator;
      }

      if (conversion === null) continue;

      for (const generated of conversion.generate()) {
        if (!(conversion instanceof EndTimeObjectPatternGenerator)) {
          this._lastPattern = generated;
        }

        if (conversion instanceof HitObjectPatternGenerator) {
          this._lastStair = conversion.stairType;
        }

        for (const obj of generated.hitObjects) {
          yield obj;
        }
      }
    }
  }
}
