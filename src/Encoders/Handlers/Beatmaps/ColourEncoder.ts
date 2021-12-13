import { IBeatmap } from 'osu-classes';

/**
 * An encoder for beatmap colours.
 */
export abstract class ColourEncoder {
  /**
   * Encodes all beatmap colours.
   * @param beatmap A beatmap.
   * @returns A single string with encoded beatmap colours. 
   */
  static encodeColours(beatmap: IBeatmap): string {
    const colours = beatmap.colours;

    // Skip this section if empty.
    if (Object.keys(colours).length === 1 && !colours.comboColours.length) {
      return '';
    }

    const encoded: string[] = ['[Colours]'];

    colours.comboColours.forEach((colour, i) => {
      encoded.push(`Combo${i + 1}:${colour}`);
    });

    if (colours.sliderTrackColor) {
      encoded.push(`SliderTrackOverride:${colours.sliderTrackColor}`);
    }

    if (colours.sliderBorderColor) {
      encoded.push(`SliderBorder:${colours.sliderBorderColor}`);
    }

    return encoded.join('\n');
  }
}
