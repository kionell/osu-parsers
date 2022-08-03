import { IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap colors.
 */
export abstract class BeatmapColorEncoder {
  /**
   * Encodes all beatmap colors.
   * @param beatmap A beatmap.
   * @returns A single string with encoded beatmap colors. 
   */
  static encodeColors(beatmap: IBeatmap): string {
    const colors = beatmap.colors;

    // Skip this section if empty.
    if (Object.keys(colors).length === 1 && !colors.comboColors.length) {
      return '';
    }

    const encoded: string[] = ['[Colours]'];

    colors.comboColors.forEach((color, i) => {
      encoded.push(`Combo${i + 1}:${color}`);
    });

    if (colors.sliderTrackColor) {
      encoded.push(`SliderTrackOverride:${colors.sliderTrackColor}`);
    }

    if (colors.sliderBorderColor) {
      encoded.push(`SliderBorder:${colors.sliderBorderColor}`);
    }

    return encoded.join('\n');
  }
}
