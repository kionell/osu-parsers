import { DifficultyHitObject, ModCombination, StrainDecaySkill } from 'osu-classes';
import { ManiaDifficultyHitObject } from '../Preprocessing';

export class Strain extends StrainDecaySkill {
  private static INDIVIDUAL_DECAY_BASE = 0.125;
  private static OVERALL_DECAY_BASE = 0.30;
  private static RELEASE_THRESHOLD = 24;

  protected _skillMultiplier = 1;
  protected _strainDecayBase = 1;

  private readonly _startTimes: number[];
  private readonly _endTimes: number[];
  private readonly _individualStrains: number[];

  private _individualStrain = 0;
  private _overallStrain = 1;

  constructor(mods: ModCombination, totalColumns: number) {
    super(mods);

    this._startTimes = new Array(totalColumns).fill(0);
    this._endTimes = new Array(totalColumns).fill(0);
    this._individualStrains = new Array(totalColumns).fill(0);
  }

  protected _strainValueOf(current: DifficultyHitObject): number {
    const maniaCurrent = current as ManiaDifficultyHitObject;

    const startTime = maniaCurrent.startTime;
    const endTime = maniaCurrent.endTime;
    const column = maniaCurrent.baseObject.column;

    let isOverlapping = false;

    /**
     * Lowest value we can assume with the current information.
     */
    let closestEndTime = Math.abs(endTime - startTime);

    /**
     * Factor to all additional strains in case something else is held.
     */
    let holdFactor = 1;

    /**
     * Addition to the current note in case it's a hold and has to be released awkwardly.
     */
    let holdAddition = 0;

    const acceptableDifference = 1;

    for (let i = 0; i < this._endTimes.length; ++i) {
      const definitelyBigger1 = this._endTimes[i] - acceptableDifference > startTime;
      const definitelyBigger2 = endTime - acceptableDifference > this._endTimes[i];
      const definitelyBigger3 = this._endTimes[i] - acceptableDifference > endTime;

      /**
       * The current note is overlapped if a previous note or end 
       * is overlapping the current note body.
       */
      isOverlapping ||= definitelyBigger1 && definitelyBigger2;

      /**
       * We give a slight bonus to everything if something is held meanwhile.
       */
      if (definitelyBigger3) holdFactor = 1.25;

      closestEndTime = Math.min(closestEndTime, Math.abs(endTime - this._endTimes[i]));
    }

    /**
     * The hold addition is given if there was an overlap, however it is 
     * only valid if there are no other note with a similar ending.
     * Releasing multiple notes is just as easy as releasing 1. 
     * Nerfs the hold addition by half if the closest release is release_threshold away.
     * 
     *   holdAddition
     *       ^
     *   1.0 + - - - - - -+-----------
     *       |           /
     *   0.5 + - - - - -/   Sigmoid Curve
     *       |         /|
     *   0.0 +--------+-+---------------> Release Difference / ms
     *           release_threshold
     */
    if (isOverlapping) {
      holdAddition = 1 / (1 + Math.exp(0.5 * (Strain.RELEASE_THRESHOLD - closestEndTime)));
    }

    /**
     * Decay and increase individualStrains in own column.
     */
    this._individualStrains[column] = Strain._applyDecay(
      this._individualStrains[column],
      startTime - this._startTimes[column],
      Strain.INDIVIDUAL_DECAY_BASE,
    );

    this._individualStrains[column] += 2.0 * holdFactor;

    /**
     * For notes at the same time (in a chord), the {@link _individualStrain}
     * should be the hardest individualStrain out of those columns
     */
    this._individualStrain = maniaCurrent.deltaTime <= 1
      ? Math.max(this._individualStrain, this._individualStrains[column])
      : this._individualStrains[column];

    /**
     * Decay and increase {@link _overallStrain}.
     */
    this._overallStrain = Strain._applyDecay(
      this._overallStrain,
      current.deltaTime,
      Strain.OVERALL_DECAY_BASE,
    );

    this._overallStrain += (1 + holdAddition) * holdFactor;

    /**
     * Update startTimes and endTimes arrays.
     */
    this._startTimes[column] = startTime;
    this._endTimes[column] = endTime;

    /**
     * By subtracting CurrentStrain, this skill effectively only considers
     * the maximum strain of any one hitobject within each strain section.
     */
    return this._individualStrain + this._overallStrain - this._currentStrain;
  }

  protected _calculateInitialStrain(time: number, current: DifficultyHitObject): number {
    const decay1 = Strain._applyDecay(
      this._individualStrain,
      time - (current.previous(0)?.startTime ?? 0),
      Strain.INDIVIDUAL_DECAY_BASE,
    );

    const decay2 = Strain._applyDecay(
      this._overallStrain,
      time - (current.previous(0)?.startTime ?? 0),
      Strain.OVERALL_DECAY_BASE,
    );

    return decay1 + decay2;
  }

  private static _applyDecay(value: number, deltaTime: number, decayBase: number) {
    return value * Math.pow(decayBase, deltaTime / 1000);
  }
}
