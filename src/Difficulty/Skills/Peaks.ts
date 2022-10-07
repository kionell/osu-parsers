import { DifficultyHitObject, Skill } from 'osu-classes';
import { TaikoModCombination } from '../../Mods';
import { Rhythm } from './Rhythm';
import { Colour } from './Colour';
import { Stamina } from './Stamina';

export class Peaks extends Skill {
  private static FINAL_MULTIPLIER = 0.0625;

  private static RHYTHM_SKILL_MULTIPLIER = 0.2 * this.FINAL_MULTIPLIER;
  private static COLOUR_SKILL_MULTIPLIER = 0.375 * this.FINAL_MULTIPLIER;
  private static STAMINA_SKILL_MULTIPLIER = 0.375 * this.FINAL_MULTIPLIER;

  readonly rhythm: Rhythm;
  readonly colour: Colour;
  readonly stamina: Stamina;

  constructor(mods: TaikoModCombination) {
    super(mods);

    this.rhythm = new Rhythm(mods);
    this.colour = new Colour(mods);
    this.stamina = new Stamina(mods);
  }

  get colourDifficultyValue(): number {
    return this.colour.difficultyValue * Peaks.COLOUR_SKILL_MULTIPLIER;
  }

  get rhythmDifficultyValue(): number {
    return this.rhythm.difficultyValue * Peaks.RHYTHM_SKILL_MULTIPLIER;
  }

  get staminaDifficultyValue(): number {
    return this.stamina.difficultyValue * Peaks.STAMINA_SKILL_MULTIPLIER;
  }

  /**
   * Returns the p-norm of an n-dimensional vector.
   * @param p The value of p to calculate the norm for.
   * @param values The coefficients of the vector.
   */

  private _norm(p: number, ...values: number[]) {
    const sum = values.reduce((sum, x) => sum + Math.pow(x, p), 0);

    return Math.pow(sum, 1 / p);
  }

  process(current: DifficultyHitObject): void {
    this.rhythm.process(current);
    this.colour.process(current);
    this.stamina.process(current);
  }

  /**
   * For each section, the peak strains of all separate skills 
   * are combined into a single peak strain for the section.
   * The resulting partial rating of the beatmap is a weighted sum 
   * of the combined peaks (higher peaks are weighted more).
   * @returns The combined star rating of the beatmap, 
   * calculated using peak strains from all sections of the map.
   */
  get difficultyValue(): number {
    const peaks: number[] = [];

    const colourPeaks = [...this.colour.getCurrentStrainPeaks()];
    const rhythmPeaks = [...this.rhythm.getCurrentStrainPeaks()];
    const staminaPeaks = [...this.stamina.getCurrentStrainPeaks()];

    for (let i = 0; i < colourPeaks.length; ++i) {
      const colourPeak = colourPeaks[i] * Peaks.COLOUR_SKILL_MULTIPLIER;
      const rhythmPeak = rhythmPeaks[i] * Peaks.RHYTHM_SKILL_MULTIPLIER;
      const staminaPeak = staminaPeaks[i] * Peaks.STAMINA_SKILL_MULTIPLIER;

      let peak = this._norm(1.5, colourPeak, staminaPeak);

      peak = this._norm(2, peak, rhythmPeak);

      /**
       * Sections with 0 strain are excluded to avoid worst-case 
       * time complexity of the following sort (e.g. /b/2351871).
       * These sections will not contribute to the difficulty.
       */
      if (peak > 0) peaks.push(peak);
    }

    let difficulty = 0;
    let weight = 1;

    for (const strain of peaks.sort((a, b) => b - a)) {
      difficulty += strain * weight;
      weight *= 0.9;
    }

    return difficulty;
  }
}
