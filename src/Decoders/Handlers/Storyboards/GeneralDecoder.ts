import { Storyboard } from 'osu-classes';

/**
 * A decoder for general info of a beatmap.
 */
export abstract class GeneralDecoder {
  /**
   * Decodes beatmap general line and adds info to a storyboard.
   * @param line General section line.
   * @param storyboard A parsed storyboard.
   */
  static handleLine(line: string, storyboard: Storyboard): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    if (key === 'UseSkinSprites') {
      storyboard.useSkinSprites = value === '1';
    }
  }
}
