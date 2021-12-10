import { DifficultyHitObject } from '../Preprocessing/DifficultyHitObject';
import { Skill } from './Skill';

/**
 * Used to processes strain values of difficulty hit objects, 
 * keep track of strain levels caused by the processed objects
 * and to calculate a final difficulty value representing 
 * the difficulty of hitting all the processed objects.
 */
export abstract class StrainSkill extends Skill {
  /**
   * The weight by which each strain value decays.
   */
  protected _decayWeight = 0.9;

  /**
   * The length of each strain section.
   */
  protected _sectionLength = 400;

  /**
   * We also keep track of the peak strain level in the current section.
   */
  private _currentSectionPeak = 0;
  private _currentSectionEnd = 0;

  private readonly _strainPeaks: number[] = [];

  /**
   * @returns The strain value at difficulty hit object. 
   * This value is calculated with or without respect to previous objects.
   */
  protected abstract _strainValueAt(current: DifficultyHitObject): number;

  /**
   * Process a difficulty hit object and update current strain values accordingly.
   */
  protected _process(current: DifficultyHitObject ): void {
    /**
     * The first object doesn't generate a strain, 
     * so we begin with an incremented section end.
     */
    if (this._previous.count === 0) {
      this._currentSectionEnd = Math.ceil(current.startTime / this._sectionLength);
      this._currentSectionEnd *= this._sectionLength;
    }

    while (current.startTime > this._currentSectionEnd) {
      this._saveCurrentPeak();
      this._startNewSectionFrom(this._currentSectionEnd);
      this._currentSectionEnd += this._sectionLength;
    }

    this._currentSectionPeak = Math.max(this._strainValueAt(current), this._currentSectionPeak);
  }

  /**
   * Saves the current peak strain level to the list of strain peaks, 
   * which will be used to calculate an overall difficulty.
   */
  private _saveCurrentPeak(): void {
    this._strainPeaks.push(this._currentSectionPeak);
  }

  /**
   * Sets the initial strain level for a new section.
   * @param time The beginning of the new section in milliseconds.
   */
  private _startNewSectionFrom(time: number): void {
    /**
     * The maximum strain of the new section is not zero by default
     * This means we need to capture the strain level at the beginning of the new section, 
     * and use that as the initial peak level.
     */
    this._currentSectionPeak = this._calculateInitialStrain(time);
  }

  /**
   * Retrieves the peak strain at a point in time.
   * @param time The time to retrieve the peak strain at.
   * @returns The peak strain.
   */
  protected abstract _calculateInitialStrain(time: number): number;

  /**
   * Returns a live enumerable of the peak strains 
   * for each "section length" section of the beatmap,
   * including the peak of the current section.
   */
  *getCurrentStrainPeaks(): Generator<number> {
    for (const peak of this._strainPeaks) {
      yield peak;
    }

    yield this._currentSectionPeak;
  }

  /**
   * Returns the calculated difficulty value representing 
   * all difficulty hit objects that have been processed up to this point.
   */
  get difficultyValue(): number {
    let difficulty = 0;
    let weight = 1;

    const peaks = [...this.getCurrentStrainPeaks()];

    peaks.sort((a, b) => b - a);

    /**
     * Difficulty is the weighted sum of the highest strains from every section.
     * We're sorting from highest to lowest strain.
     */
    for (const strain of peaks) {
      difficulty += strain * weight;
      weight *= this._decayWeight;
    }

    return difficulty;
  }
}
