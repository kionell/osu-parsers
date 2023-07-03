import { Color4 } from 'osu-classes';
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
    const [key, ...values] = line.split(':');

    const rgba = values
      .join(':')
      .trim()
      .split(',')
      .map((c) => Parsing.parseByte(c));

    if (rgba.length !== 3 && rgba.length !== 4) {
      throw new Error(`Color specified in incorrect format (should be R,G,B or R,G,B,A): ${rgba.join(',')}`);
    }

    const color = new Color4(rgba[0], rgba[1], rgba[2], rgba[3]);

    this.addColor(color, output, key.trim());
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
}
