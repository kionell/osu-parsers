import { DifficultyHitObject, ModCombination, StrainDecaySkill } from 'osu-classes';
import { ManiaDifficultyHitObject } from '../Preprocessing';

export class Strain extends StrainDecaySkill {
  private static INDIVIDUAL_DECAY_BASE = 0.125;
  private static OVERALL_DECAY_BASE = 0.30;

  protected _skillMultiplier = 1;
  protected _strainDecayBase = 1;

  private readonly _holdEndTimes: number[];
  private readonly _individualStrains: number[];

  private _individualStrain = 0;
  private _overallStrain = 1;

  constructor(mods: ModCombination, totalColumns: number) {
    super(mods);

    this._holdEndTimes = new Array(totalColumns).fill(0);
    this._individualStrains = new Array(totalColumns).fill(0);
  }

  protected _strainValueOf(current: DifficultyHitObject): number {
    const maniaCurrent = current as ManiaDifficultyHitObject;

    const endTime = maniaCurrent.endTime;
    const column = maniaCurrent.baseObject.column;

    /**
     * Factor to all additional strains in case something else is held.
     */
    let holdFactor = 1;

    /**
     * Addition to the current note in case it's a hold and has to be released awkwardly.
     */
    let holdAddition = 0;

    /**
     * Fill up the holdEndTimes array.
     */
    for (let i = 0; i < this._holdEndTimes.length; ++i) {
      /**
       * If there is at least one other overlapping end or note, 
       * then we get an addition, buuuuuut...
       */
      const definitelyBigger1 = this._holdEndTimes[i] - 1 > maniaCurrent.startTime;
      const definitelyBigger2 = endTime - 1 > this._holdEndTimes[i];

      if (definitelyBigger1 && definitelyBigger2) {
        holdAddition = 1;
      }

      /**
       * ... this addition only is valid if there is no other note with the same ending. 
       * Releasing multiple notes at the same time is just as easy as releasing 1
       */
      if (Math.abs(endTime - this._holdEndTimes[i]) <= 1) {
        holdAddition = 0;
      }

      /**
       * We give a slight bonus to everything if something is held meanwhile.
       */
      if (this._holdEndTimes[i] - 1 > endTime) {
        holdFactor = 1.25;
      }

      /**
       * Decay individual strains.
       */
      this._individualStrains[i] = Strain._applyDecay(
        this._individualStrains[i],
        current.deltaTime,
        Strain.INDIVIDUAL_DECAY_BASE,
      );
    }

    this._holdEndTimes[column] = endTime;

    /**
     * Increase individual strain in own column.
     */
    this._individualStrains[column] += 2 * holdFactor;
    this._individualStrain = this._individualStrains[column];

    this._overallStrain = Strain._applyDecay(
      this._overallStrain,
      current.deltaTime,
      Strain.OVERALL_DECAY_BASE,
    );

    this._overallStrain += (1 + holdAddition) * holdFactor;

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
