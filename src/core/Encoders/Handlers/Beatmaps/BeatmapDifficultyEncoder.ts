import { IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap difficulty.
 */
export abstract class BeatmapDifficultyEncoder {
  /**
   * Encodes the beatmap difficulty.
   * @param beatmap A beatmap.
   * @returns Encoded beatmap difficulty.
   */
  static encodeDifficultySection(beatmap: IBeatmap): string {
    const encoded: string[] = ['[Difficulty]'];

    const difficulty = beatmap.difficulty;

    encoded.push(`HPDrainRate:${difficulty.drainRate}`);
    encoded.push(`CircleSize:${difficulty.circleSize}`);
    encoded.push(`OverallDifficulty:${difficulty.overallDifficulty}`);
    encoded.push(`ApproachRate:${difficulty.approachRate}`);
    encoded.push(`SliderMultiplier:${difficulty.sliderMultiplier}`);
    encoded.push(`SliderTickRate:${difficulty.sliderTickRate}`);

    return encoded.join('\n');
  }
}
