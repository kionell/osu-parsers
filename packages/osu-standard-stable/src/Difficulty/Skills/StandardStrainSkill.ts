import { MathUtils, StrainSkill } from 'osu-classes';

export abstract class StandardStrainSkill extends StrainSkill {
  /**
   * The default multiplier applied by {@link StandardStrainSkill} 
   * to the final difficulty value after all other calculations.
   */
  static DEFAULT_DIFFICULTY_MULTIPLIER = 1.06;

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
  protected _difficultyMultiplier = StandardStrainSkill.DEFAULT_DIFFICULTY_MULTIPLIER;

  get difficultyValue(): number {
    let difficulty = 0;
    let weight = 1;

    /**
     * Sections with 0 strain are excluded to avoid worst-case time complexity of the following sort (e.g. /b/2351871).
     * These sections will not contribute to the difficulty.
     */
    const strains = [...this.getCurrentStrainPeaks()]
      .filter((p) => p > 0)
      .sort((a, b) => b - a);

    /**
     * We are reducing the highest strains first to account for extreme difficulty spikes
     */
    const lerp = (start: number, final: number, amount: number) => {
      return start + (final - start) * amount;
    };

    const length = Math.min(strains.length, this._reducedSectionCount);

    for (let i = 0; i < length; ++i) {
      const value = Math.fround(i / this._reducedSectionCount);
      const clamp = MathUtils.clamp01(value);
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
