import { Color4 } from 'osu-classes';
import { IHasBeatmapColors } from '../../../Interfaces';
import { Parsing } from '../../../Utils';

/**
 * A decoder for beatmap colors.
 */
export abstract class ColorDecoder {
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

    switch (key) {
      case 'SliderTrackOverride':
        output.colors.sliderTrackColor = color;
        break;

      case 'SliderBorder':
        output.colors.sliderBorderColor = color;
    }

    if (key.startsWith('Combo')) {
      output.colors.comboColors.push(color);
    }
  }
}
