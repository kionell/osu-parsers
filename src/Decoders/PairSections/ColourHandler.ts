import { Colour } from 'osu-resources';

import { ParsedBeatmap } from '../../Classes/ParsedBeatmap';

/**
 * A decoder for beatmap colours.
 */
export abstract class ColourHandler {
  /**
   * Decodes a colour line and adds a new colour to the beatmap.
   * @param line A colour line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: ParsedBeatmap): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values
      .join(' ')
      .split(',')
      .map((c) => +c);

    const colour = new Colour(value[0], value[1], value[2]);

    switch (key) {
      case 'SliderTrackOverride':
        beatmap.colours.sliderTrackColor = colour;
        break;

      case 'SliderBorder':
        beatmap.colours.sliderBorderColor = colour;
        break;

      default:
        beatmap.colours.comboColours.push(colour);
    }
  }
}
