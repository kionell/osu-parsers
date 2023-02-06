import { DifficultyHitObject, ModCombination, StrainDecaySkill } from 'osu-classes';
import { CatchDifficultyHitObject } from '../Preprocessing';

export class Movement extends StrainDecaySkill {
  private static _ABSOLUTE_PLAYER_POSITIONING_ERROR = 16;
  private static _NORMALIZED_HITOBJECT_RADIUS = 41;
  private static _DIRECTION_CHANGE_BONUS = 21;

  protected _skillMultiplier = 900;
  protected _strainDecayBase = 0.2;
  protected _decayWeight = 0.94;
  protected _sectionLength = 750;

  protected readonly _halfCatcherWidth: number;

  private _lastPlayerPosition?: number;
  private _lastDistanceMoved = 0;
  private _lastStrainTime = 0;

  /**
   * The speed multiplier applied to the player's catcher.
   */
  private readonly _catcherSpeedMultiplier: number;

  constructor(mods: ModCombination, halfCatcherWidth: number, clockRate: number) {
    super(mods);

    this._halfCatcherWidth = halfCatcherWidth;

    /**
     * In catch, clockrate adjustments do not only affect the timings of hitobjects,
     * but also the speed of the player's catcher, which has an impact on difficulty.
     * TODO: Support variable clockrates caused by mods such as ModTimeRamp
     */
    this._catcherSpeedMultiplier = clockRate;
  }

  protected _strainValueOf(current: DifficultyHitObject): number {
    const catchCurrent = current as CatchDifficultyHitObject;

    this._lastPlayerPosition ??= catchCurrent.lastNormalizedPosition;

    const normalizedRaidus = Math.fround(Movement._NORMALIZED_HITOBJECT_RADIUS);
    const positioningError = Math.fround(Movement._ABSOLUTE_PLAYER_POSITIONING_ERROR);
    const directionBonus = Math.fround(Movement._DIRECTION_CHANGE_BONUS);

    const offset = Math.fround(normalizedRaidus - positioningError);
    const min = Math.fround(catchCurrent.normalizedPosition - offset);
    const max = Math.fround(catchCurrent.normalizedPosition + offset);

    let playerPosition = Math.min(Math.max(this._lastPlayerPosition, min), max);

    const distanceMoved = Math.fround(playerPosition - this._lastPlayerPosition);
    const weightedStrainTime = catchCurrent.strainTime + 13 + (3 / this._catcherSpeedMultiplier);
    const sqrtStrain = Math.sqrt(weightedStrainTime);

    let distanceAddition = (Math.pow(Math.abs(distanceMoved), 1.3) / 510);
    let edgeDashBonus = 0;

    /**
     * Direction change bonus.
     */
    if (Math.abs(distanceMoved) > 0.1) {
      const signDiff = Math.sign(distanceMoved) !== Math.sign(this._lastDistanceMoved);

      if (Math.abs(this._lastDistanceMoved) > 0.1 && signDiff) {
        const bonusFactor = Math.fround(Math.min(50, Math.abs(distanceMoved)) / 50);
        const antiflowFactor = Math.max(
          Math.fround(Math.min(70, Math.abs(this._lastDistanceMoved)) / 70),
          0.38,
        );

        const sqrt = Math.sqrt(this._lastStrainTime + 16);
        const max = Math.max(1 - Math.pow(weightedStrainTime / 1000, 3), 0);

        distanceAddition += directionBonus / sqrt * bonusFactor * antiflowFactor * max;
      }

      /**
       * Base bonus for every movement, giving some weight to streams.
       */
      const min = Math.min(Math.abs(distanceMoved), normalizedRaidus * 2);

      distanceAddition += 12.5 * min / (normalizedRaidus * 6) / sqrtStrain;
    }

    /**
     * Bonus for edge dashes.
     */
    if (catchCurrent.lastObject.distanceToHyperDash <= 20) {
      if (!catchCurrent.lastObject.hasHyperDash) {
        edgeDashBonus += 5.7;
      }
      else {
        /**
         * After a hyperdash we ARE in the correct position. Always!
         */
        playerPosition = catchCurrent.normalizedPosition;
      }

      const hyperDash = Math.fround(
        Math.fround(20 - catchCurrent.lastObject.distanceToHyperDash) / 20,
      );

      const min = Math.min(catchCurrent.strainTime * this._catcherSpeedMultiplier, 265);
      const pow = Math.pow((min / 265), 1.5);

      /**
       * Edge Dashes are easier at lower ms values.
       */
      distanceAddition *= 1 + edgeDashBonus * hyperDash * pow;
    }

    this._lastPlayerPosition = playerPosition;
    this._lastDistanceMoved = distanceMoved;
    this._lastStrainTime = catchCurrent.strainTime;

    return distanceAddition / weightedStrainTime;
  }
}
