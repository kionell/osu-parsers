import { DifficultyHitObject } from 'osu-classes';
import { Hit } from '../../../Objects';
import { TaikoDifficultyHitObject } from '../TaikoDifficultyHitObject';
import { AlternatingMonoPattern } from './Data/AlternatingMonoPattern';
import { MonoStreak } from './Data/MonoStreak';
import { RepeatingHitPatterns } from './Data/RepeatingHitPatterns';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TaikoDifficultyHitObjectColour } from './TaikoDifficultyHitObjectColour';

/**
 * Utility class to perform various encodings.
 */
export class TaikoColourDifficultyPreprocessor {
  /**
   * Processes and encodes a list of {@link TaikoDifficultyHitObject}s 
   * into a list of {@link TaikoDifficultyHitObjectColour}s,
   * assigning the appropriate {@link TaikoDifficultyHitObjectColour}s 
   * to each {@link TaikoDifficultyHitObject},
   * and pre-evaluating colour difficulty of each {@link TaikoDifficultyHitObject}.
   */
  static processAndAssign(hitObjects: DifficultyHitObject[]): void {
    const hitPatterns: RepeatingHitPatterns[] = this._encode(hitObjects);

    /**
     * Assign indexing and encoding data to all relevant objects. 
     * Only the first note of each encoding type is assigned with the relevant encodings.
     */
    for (const repeatingHitPattern of hitPatterns) {
      repeatingHitPattern.firstHitObject.colour.repeatingHitPattern = repeatingHitPattern;

      /**
       * The outermost loop is kept a ForEach loop since 
       * it doesn't need index information, and we want to
       * keep i and j for AlternatingMonoPattern's and MonoStreak's 
       * index respectively, to keep it in line with documentation.
       */
      const length = repeatingHitPattern.alternatingMonoPatterns.length;

      for (let i = 0; i < length; ++i) {
        const monoPattern = repeatingHitPattern.alternatingMonoPatterns[i];

        monoPattern.parent = repeatingHitPattern;
        monoPattern.index = i;
        monoPattern.firstHitObject.colour.alternatingMonoPattern = monoPattern;

        for (let j = 0; j < monoPattern.monoStreaks.length; ++j) {
          const monoStreak = monoPattern.monoStreaks[j];

          monoStreak.parent = monoPattern;
          monoStreak.index = j;
          monoStreak.firstHitObject.colour.monoStreak = monoStreak;
        }
      }
    }
  }

  /**
   * Encodes a list of {@link TaikoDifficultyHitObject}s into a list of {@link RepeatingHitPatterns}s.
   */
  private static _encode(data: DifficultyHitObject[]): RepeatingHitPatterns[] {
    const monoStreaks = this._encodeMonoStreak(data);
    const alternatingMonoPatterns = this._encodeAlternatingMonoPattern(monoStreaks);
    const repeatingHitPatterns = this._encodeRepeatingHitPattern(alternatingMonoPatterns);

    return repeatingHitPatterns;
  }

  /**
   * Encodes a list of {@link TaikoDifficultyHitObject}s into a list of {@link MonoStreak}s.
   */
  private static _encodeMonoStreak(data: DifficultyHitObject[]): MonoStreak[] {
    const monoStreaks: MonoStreak[] = [];
    let currentMonoStreak: MonoStreak | null = null;

    for (let i = 0; i < data.length; ++i) {
      const taikoObject = data[i] as TaikoDifficultyHitObject;

      /**
       * This ignores all non-note objects, which may or may not be the desired behaviour.
       */
      const previousObject: TaikoDifficultyHitObject | null = taikoObject.previousNote(0);

      /**
       * If this is the first object in the list or the colour changed, create a new mono streak.
       */
      const baseHit = taikoObject.baseObject as Hit;
      const previousHit = previousObject?.baseObject as Hit;

      if (currentMonoStreak === null ||
        previousObject === null ||
        baseHit?.isRim !== previousHit?.isRim) {
        currentMonoStreak = new MonoStreak();
        monoStreaks.push(currentMonoStreak);
      }

      /**
       * Add the current object to the encoded payload.
       */
      currentMonoStreak.hitObjects.push(taikoObject);
    }

    return monoStreaks;
  }

  /**
   * Encodes a list of {@link MonoStreak}s into a list of {@link AlternatingMonoPattern}s.
   */
  private static _encodeAlternatingMonoPattern(data: MonoStreak[]): AlternatingMonoPattern[] {
    const monoPatterns: AlternatingMonoPattern[] = [];
    let currentMonoPattern: AlternatingMonoPattern | null = null;

    for (let i = 0; i < data.length; ++i) {
      /**
       * Start a new {@link AlternatingMonoPattern} if the previous {@link MonoStreak} 
       * has a different mono length, or if this is the first {@link MonoStreak} in the list.
       */
      if (currentMonoPattern === null || data[i].runLength !== data[i - 1].runLength) {
        currentMonoPattern = new AlternatingMonoPattern();
        monoPatterns.push(currentMonoPattern);
      }

      /**
       * Add the current MonoStreak to the encoded payload.
       */
      currentMonoPattern.monoStreaks.push(data[i]);
    }

    return monoPatterns;
  }

  /**
   * Encodes a list of {@link AlternatingMonoPattern}s into a list of {@link RepeatingHitPatterns}s.
   */
  private static _encodeRepeatingHitPattern(data: AlternatingMonoPattern[]): RepeatingHitPatterns[] {
    const hitPatterns: RepeatingHitPatterns[] = [];
    let currentHitPattern: RepeatingHitPatterns | null = null;

    for (let i = 0; i < data.length; ++i) {
      /**
       * Start a new {@link RepeatingHitPattern}. {@link AlternatingMonoPatterns} 
       * that should be grouped together will be handled later within this loop.
       */
      currentHitPattern = new RepeatingHitPatterns(currentHitPattern);

      /**
       * Determine if future AlternatingMonoPatterns should be grouped.
       */
      let isCoupled = i < data.length - 2 && data[i].isRepetitionOf(data[i + 2]);

      if (!isCoupled) {
        /**
         * If not, add the current AlternatingMonoPattern to the encoded payload and continue.
         */
        currentHitPattern.alternatingMonoPatterns.push(data[i]);
      }
      else {
        /**
         * If so, add the current AlternatingMonoPattern to 
         * the encoded payload and start repeatedly checking if the
         * subsequent AlternatingMonoPatterns should be grouped by 
         * increasing i and doing the appropriate isCoupled check.
         */
        while (isCoupled) {
          currentHitPattern.alternatingMonoPatterns.push(data[i]);
          i++;
          isCoupled = i < data.length - 2 && data[i].isRepetitionOf(data[i + 2]);
        }

        /**
         * Skip over viewed data and add the rest to the payload.
         */
        currentHitPattern.alternatingMonoPatterns.push(data[i]);
        currentHitPattern.alternatingMonoPatterns.push(data[i + 1]);
        i++;
      }

      hitPatterns.push(currentHitPattern);
    }

    /**
     * Final pass to find repetition intervals.
     */
    for (let i = 0; i < hitPatterns.length; ++i) {
      hitPatterns[i].findRepetitionInterval();
    }

    return hitPatterns;
  }
}
