import { Beatmap } from 'osu-classes';

/**
 * A decoder for beatmap difficulty.
 */
export abstract class DifficultyHandler {
  /**
   * Decodes beatmap difficulty line and adds difficulty data to a beatmap.
   * @param line Difficulty section line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'CircleSize':
        beatmap.difficulty.circleSize = parseFloat(value);
        break;

      case 'HPDrainRate':
        beatmap.difficulty.drainRate = parseFloat(value);
        break;

      case 'OverallDifficulty':
        beatmap.difficulty.overallDifficulty = parseFloat(value);
        break;

      case 'ApproachRate':
        beatmap.difficulty.approachRate = parseFloat(value);
        break;

      case 'SliderMultiplier':
        beatmap.difficulty.sliderMultiplier = parseFloat(value);
        break;

      case 'SliderTickRate':
        beatmap.difficulty.sliderTickRate = parseFloat(value);
    }
  }
}
