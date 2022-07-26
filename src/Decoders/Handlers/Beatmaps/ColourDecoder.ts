import { Beatmap, Color4 } from 'osu-classes';
import { Parsing } from '../../../Utils';

/**
 * A decoder for beatmap colours.
 */
export abstract class ColourDecoder {
  /**
   * Decodes a colour line and adds a new colour to the beatmap.
   * @param line A colour line.
   * @param beatmap A parsed beatmap.
   */
  static handleLine(line: string, beatmap: Beatmap): void {
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
        beatmap.colours.sliderTrackColor = color;
        break;

      case 'SliderBorder':
        beatmap.colours.sliderBorderColor = color;
    }

    if (key.startsWith('Combo')) {
      beatmap.colours.comboColours.push(color);
    }
  }
}
