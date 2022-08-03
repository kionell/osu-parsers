import { Beatmap } from 'osu-classes';
import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for beatmap difficulty.
 */
export abstract class BeatmapDifficultyDecoder {
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
        beatmap.difficulty.circleSize = Parsing.parseFloat(value);
        break;

      case 'HPDrainRate':
        beatmap.difficulty.drainRate = Parsing.parseFloat(value);
        break;

      case 'OverallDifficulty':
        beatmap.difficulty.overallDifficulty = Parsing.parseFloat(value);
        break;

      case 'ApproachRate':
        beatmap.difficulty.approachRate = Parsing.parseFloat(value);
        break;

      case 'SliderMultiplier':
        beatmap.difficulty.sliderMultiplier = Parsing.parseFloat(value);
        break;

      case 'SliderTickRate':
        beatmap.difficulty.sliderTickRate = Parsing.parseFloat(value);
    }
  }
}
