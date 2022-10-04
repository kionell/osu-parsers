import { DifficultyHitObject } from 'osu-classes';
import { Slider, Spinner } from '../../Objects';
import { StandardDifficultyHitObject } from '../Preprocessing';

export class RhythmEvaluator {
  /**
   * 5 seconds of calculatingRhythmBonus max.
   */
  private static _HISTORY_TIME_MAX = 5000;
  private static _RHYTHM_MULTIPLIER = 0.75;

  /**
   * Calculates a rhythm multiplier for the difficulty of the tap associated 
   * with historic data of the current {@link StandardDifficultyHitObject}.
   * @param current Current difficulty hit object.
   * @returns Rhythm value at this {@link StandardDifficultyHitObject}.
   */
  static evaluateDifficultyOf(current: DifficultyHitObject): number {
    if (current.baseObject instanceof Spinner) return 0;

    /**
     * Store the ratio of the current start of an island to buff for tighter rhythms.
     */
    let startRatio = 0;
    let firstDeltaSwitch = false;
    let rhythmStart = 0;
    let previousIslandSize = 0;
    let rhythmComplexitySum = 0;
    let islandSize = 1;

    const historicalNoteCount = Math.min(current.index, 32);
    const timeDiff = current.startTime - current.previous(rhythmStart).startTime;

    while (rhythmStart < historicalNoteCount - 2 && timeDiff < this._HISTORY_TIME_MAX) {
      rhythmStart++;
    }

    for (let i = rhythmStart; i > 0; --i) {
      const currObj = current.previous(i - 1) as StandardDifficultyHitObject;
      const prevObj = current.previous(i) as StandardDifficultyHitObject;
      const lastObj = current.previous(i + 1) as StandardDifficultyHitObject;

      /**
       * Scales note 0 to 1 from history to now.
       */
      let currHistoricalDecay = (
        this._HISTORY_TIME_MAX - (current.startTime - currObj.startTime)
      ) / this._HISTORY_TIME_MAX;

      /**
       * Either we're limited by time or limited by object count.
       */
      currHistoricalDecay = Math.min(
        (historicalNoteCount - i) / historicalNoteCount,
        currHistoricalDecay,
      );

      const currDelta = currObj.strainTime;
      const prevDelta = prevObj.strainTime;
      const lastDelta = lastObj.strainTime;

      const x1 = Math.min(prevDelta, currDelta) / Math.max(prevDelta, currDelta);

      /**
       * Fancy function to calculate rhythmbonuses.
       */
      const currRatio = 1 + 6 * Math.min(0.5, Math.pow(Math.sin(Math.PI / x1), 2));

      const x2 = Math.max(0, Math.abs(prevDelta - currDelta) - currObj.hitWindowGreat * 0.3);

      let windowPenalty = Math.min(1, x2 / (currObj.hitWindowGreat * 0.3));

      windowPenalty = Math.min(1, windowPenalty);

      let effectiveRatio = windowPenalty * currRatio;

      if (firstDeltaSwitch) {
        if (!(prevDelta > 1.25 * currDelta || prevDelta * 1.25 < currDelta)) {
          /**
           * Island is still progressing, count size.
           */
          if (islandSize < 7) islandSize++;
        }
        else {
          /**
           * BPM change is into slider, this is easy acc window.
           */
          if (current.previous(i - 1).baseObject instanceof Slider) {
            effectiveRatio *= 0.125;
          }

          /**
           * BPM change was from a slider, this is easier typically than circle -> circle
           */
          if (current.previous(i).baseObject instanceof Slider) {
            effectiveRatio *= 0.25;
          }

          /**
           * Repeated island size (ex: triplet -> triplet)
           */
          if (previousIslandSize === islandSize) {
            effectiveRatio *= 0.25;
          }

          /**
           * Repeated island polartiy (2 -> 4, 3 -> 5)
           */
          if (previousIslandSize % 2 === islandSize % 2) {
            effectiveRatio *= 0.50;
          }

          /**
           * Previous increase happened a note ago, 1/1->1/2-1/4, dont want to buff this.
           */
          if (lastDelta > prevDelta + 10 && prevDelta > currDelta + 10) {
            effectiveRatio *= 0.125;
          }

          const sqrt1 = Math.sqrt(effectiveRatio * startRatio);
          const sqrt2 = Math.sqrt(4 + islandSize);
          const sqrt3 = Math.sqrt(4 + previousIslandSize);

          rhythmComplexitySum += sqrt1 * currHistoricalDecay * sqrt2 / 2 * sqrt3 / 2;

          startRatio = effectiveRatio;

          /**
           * Log the last island size.
           */
          previousIslandSize = islandSize;

          /**
           * We're slowing down, stop counting.
           */
          if (prevDelta * 1.25 < currDelta) {
            /**
             * If we're speeding up, this stays true and we keep counting island size.
             */
            firstDeltaSwitch = false;
          }

          islandSize = 1;
        }
      }
      else if (prevDelta > 1.25 * currDelta) {
        /**
         * Begin counting island until we change speed again.
         */
        firstDeltaSwitch = true;
        startRatio = effectiveRatio;
        islandSize = 1;
      }
    }

    /**
     * Produces multiplier that can be applied to strain. 
     * Range [1, infinity) (not really though)
     */
    return Math.sqrt(4 + rhythmComplexitySum * this._RHYTHM_MULTIPLIER) / 2;
  }
}
