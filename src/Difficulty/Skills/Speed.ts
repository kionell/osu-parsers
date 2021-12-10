import { DifficultyHitObject } from 'osu-resources';
import { Slider, Spinner } from '../../Objects';
import { StandardModCombination } from '../../Mods';
import { StandardDifficultyHitObject } from '../Preprocessing/StandardDifficultyHitObject';
import { StandardStrainSkill } from './StandardStrainSkill';

/**
 * Represents the skill required to press keys with regards 
 * to keeping up with the speed at which objects need to be hit.
 */
export class Speed extends StandardStrainSkill {
  private _SINGLE_SPACING_THRESHOLD = 125;
  private _RHYTHM_MULTIPLIER = 0.75;
  private _HISTORY_TIME_MAX = 5000; // 5 seconds of calculatingRhythmBonus max.
  private _MIN_SPEED_BONUS = 75; // ~200BPM
  private _SPEED_BALANCING_FACTOR = 40;

  private _skillMultiplier = 1375;
  private _strainDecayBase = 0.3;

  private _currentStrain = 0;
  private _currentRhythm = 0;

  protected _reducedSectionCount = 5;
  protected _difficultyMultiplier = 1.04;

  protected get _historyLength(): number {
    return 32;
  }

  private readonly _greatWindow;

  constructor(mods: StandardModCombination, hitWindowGreat: number) {
    super(mods);
    this._greatWindow = hitWindowGreat;
  }

  /**
   * Calculates a rhythm multiplier for the difficulty of the tap 
   * associated with historic data of the current difficulty hit object.
   */
  private _calculateRhythmBonus(current: DifficultyHitObject): number {
    if (current.baseObject instanceof Spinner) {
      return 0;
    }

    let previousIslandSize = 0;

    let rhythmComplexitySum = 0;
    let islandSize = 1;

    /**
     * Store the ratio of the current start of an island to buff for tighter rhythms.
     */
    let startRatio = 0;

    let firstDeltaSwitch = false;

    for (let i = this._previous.count - 2; i > 0; --i) {
      const currObj = this._previous.get(i - 1) as StandardDifficultyHitObject;
      const prevObj = this._previous.get(i) as StandardDifficultyHitObject;
      const lastObj = this._previous.get(i + 1) as StandardDifficultyHitObject;

      /**
       * Scales note 0 to 1 from history to now.
       */
      const historyTime = this._HISTORY_TIME_MAX - (current.startTime - currObj.startTime);
      let currHistoricalDecay = Math.max(0, historyTime) / this._HISTORY_TIME_MAX;

      if (currHistoricalDecay !== 0) {
        /**
         * Either we're limited by time or limited by object count.
         */
        const objectCount = (this._previous.count - i) / this._previous.count;

        currHistoricalDecay = Math.min(objectCount, currHistoricalDecay);

        const currDelta = currObj.strainTime;
        const prevDelta = prevObj.strainTime;
        const lastDelta = lastObj.strainTime;

        /**
         * Fancy function to calculate rhythmbonuses.
         */
        const x = Math.PI / (Math.min(prevDelta, currDelta) / Math.max(prevDelta, currDelta));
        const currRatio = 1.0 + 6.0 * Math.min(0.5, Math.pow(Math.sin(x), 2));

        const max = Math.max(0, Math.abs(prevDelta - currDelta) - this._greatWindow * 0.6);
        const windowPenalty = Math.min(1, Math.min(1, max / (this._greatWindow * 0.6)));

        let effectiveRatio = windowPenalty * currRatio;

        if (firstDeltaSwitch) {
          if (!(prevDelta > 1.25 * currDelta || prevDelta * 1.25 < currDelta)) {
            /**
             * Island is still progressing, count size.
             */
            if (islandSize < 7) ++islandSize;
          }
          else {
            /**
             * BPM change is into slider, this is easy acc window.
             */
            if (this._previous.get(i - 1).baseObject instanceof Slider) {
              effectiveRatio *= 0.125;
            }

            /**
             * BPM change was from a slider, this is easier typically than circle -> circle
             */
            if (this._previous.get(i).baseObject instanceof Slider) {
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
             * Previous increase happened a note ago, 1/1 -> 1/2-1/4, dont want to buff this.
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
               * If we're speeding up, this stays true and  we keep counting island size.
               */
              firstDeltaSwitch = false;
            }

            islandSize = 1;
          }
        }
        /**
         * We want to be speeding up.
         */
        else if (prevDelta > 1.25 * currDelta) {
          /**
           * Begin counting island until we change speed again.
           */
          firstDeltaSwitch = true;
          startRatio = effectiveRatio;
          islandSize = 1;
        }
      }
    }

    /**
     * Produces multiplier that can be applied to strain. 
     * range [1, infinity) (not really though)
     */
    return Math.sqrt(4 + rhythmComplexitySum * this._RHYTHM_MULTIPLIER) / 2;
  }

  private _strainValueOf(current: DifficultyHitObject): number {
    if (current.baseObject instanceof Spinner) {
      return 0;
    }

    /**
     * Derive strainTime for calculation.
     */
    const osuCurrObj = current as StandardDifficultyHitObject;
    const osuPrevObj = this._previous.count > 0
      ? this._previous.get(0) as StandardDifficultyHitObject
      : null;

    let strainTime = osuCurrObj.strainTime;
    const greatWindowFull = this._greatWindow * 2;
    const speedWindowRatio = strainTime / greatWindowFull;

    /**
     * Aim to nerf cheesy rhythms 
     * (Very fast consecutive doubles with large deltatimes between)
     */
    const lerp = (start: number, final: number, amount: number) => {
      return start + (final - start) * amount;
    };

    if (osuPrevObj !== null
      && strainTime < greatWindowFull
      && osuPrevObj.strainTime > strainTime) {
      strainTime = lerp(osuPrevObj.strainTime, strainTime, speedWindowRatio);
    }

    /**
     * Cap deltatime to the OD 300 hitwindow.
     * 0.93 is derived from making sure 260bpm OD8 streams aren't nerfed harshly, 
     * whilst 0.92 limits the effect of the cap.
     */
    strainTime /= Math.min(Math.max(strainTime / greatWindowFull / 0.93, 0.92), 1);

    /**
     * Derive speedBonus for calculation.
     */
    let speedBonus = 1.0;

    if (strainTime < this._MIN_SPEED_BONUS) {
      const bonus = (this._MIN_SPEED_BONUS - strainTime) / this._SPEED_BALANCING_FACTOR;

      speedBonus = 1 + 0.75 * Math.pow(bonus, 2);
    }

    const distance = Math.min(
      this._SINGLE_SPACING_THRESHOLD,
      osuCurrObj.travelDistance + osuCurrObj.jumpDistance,
    );

    const pow = Math.pow(distance / this._SINGLE_SPACING_THRESHOLD, 3.5);

    return (speedBonus + speedBonus * pow) / strainTime;
  }

  private _strainDecay(ms: number): number {
    return Math.pow(this._strainDecayBase, ms / 1000);
  }

  protected _calculateInitialStrain(time: number): number {
    const strainDecay = this._strainDecay(time - this._previous.get(0).startTime);

    return (this._currentStrain * this._currentRhythm) * strainDecay;
  }

  protected _strainValueAt(current: DifficultyHitObject): number {
    this._currentStrain *= this._strainDecay(current.deltaTime);
    this._currentStrain += this._strainValueOf(current) * this._skillMultiplier;

    this._currentRhythm = this._calculateRhythmBonus(current);

    return this._currentStrain * this._currentRhythm;
  }
}
