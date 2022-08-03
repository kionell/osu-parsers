import { Color4, Colour } from 'osu-classes';
import { IHasBeatmapColors } from '../../../Interfaces';
import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for beatmap colors.
 */
export abstract class BeatmapColorDecoder {
  /**
   * Decodes a color line and adds a new color to the beatmap.
   * @param line A color line.
   * @param output An object with colors information.
   */
  static handleLine(line: string, output: IHasBeatmapColors): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());

    const split = values
      .join(' ')
      .split(',')
      .map((c) => Parsing.parseByte(c));

    if (split.length !== 3 && split.length !== 4) {
      throw new Error(`Color specified in incorrect format (should be R,G,B or R,G,B,A): ${split.join(',')}`);
    }

    const color = new Color4(split[0], split[1], split[2], split[3]);

    this.addColor(color, output, key);

    if (output.colours) {
      const colour = new Colour(split[0], split[1], split[2]);

      this.addLegacyColour(colour, output, key);
    }
  }

  static addColor(color: Color4, output: IHasBeatmapColors, key: string): void {
    if (key === 'SliderTrackOverride') {
      output.colors.sliderTrackColor = color;

      return;
    }

    if (key === 'SliderBorder') {
      output.colors.sliderBorderColor = color;

      return;
    }

    if (key.startsWith('Combo')) {
      output.colors.comboColors.push(color);
    }
  }

  static addLegacyColour(colour: Colour, output: IHasBeatmapColors, key: string): void {
    if (!output.colours) return;

    if (key === 'SliderTrackOverride') {
      output.colours.sliderTrackColor = colour;

      return;
    }

    if (key === 'SliderBorder') {
      output.colours.sliderBorderColor = colour;

      return;
    }

    if (key.startsWith('Combo')) {
      output.colours.comboColours.push(colour);
    }
  }
}
