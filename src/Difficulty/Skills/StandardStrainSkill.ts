import { StrainSkill } from 'osu-resources';

export abstract class StandardStrainSkill extends StrainSkill {
  /**
   * The number of sections with the highest strains, 
   * which the peak strain reductions will apply to.
   * This is done in order to decrease their impact 
   * on the overall difficulty of the map for this skill.
   */
  protected _reducedSectionCount = 10;

  /**
   * The baseline multiplier applied to the section with the biggest strain.
   */
  protected _reducedStrainBaseline = 0.75;

  /**
   * The final multiplier to be applied to difficulty value after all other calculations.
   */
  protected _difficultyMultiplier = 1.06;

  get difficultyValue(): number {
    let difficulty = 0;
    let weight = 1;

    const strains = [...this.getCurrentStrainPeaks()].sort((a, b) => b - a);

    /**
     * We are reducing the highest strains first to account for extreme difficulty spikes
     */
    const lerp = (start: number, final: number, amount: number) => {
      return start + (final - start) * amount;
    };

    const length = Math.min(strains.length, this._reducedSectionCount);

    for (let i = 0; i < length; ++i) {
      const value = Math.fround(i / this._reducedSectionCount);
      const clamp = Math.min(Math.max(value, 0), 1);
      const scale = Math.log10(lerp(1, 10, clamp));

      strains[i] *= lerp(this._reducedStrainBaseline, 1, scale);
    }

    /**
     * Difficulty is the weighted sum of the highest strains from every section.
     * We're sorting from highest to lowest strain.
     */
    strains.sort((a, b) => b - a);

    strains.forEach((strain) => {
      difficulty += strain * weight;
      weight *= this._decayWeight;
    });

    return difficulty * this._difficultyMultiplier;
  }
}
