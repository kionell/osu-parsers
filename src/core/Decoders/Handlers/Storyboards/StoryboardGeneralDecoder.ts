import { Storyboard } from 'osu-classes';

/**
 * A decoder for general info of a storyboard.
 */
export abstract class StoryboardGeneralDecoder {
  /**
   * Decodes beatmap general line and adds info to a storyboard.
   * @param line General section line.
   * @param storyboard A parsed storyboard.
   */
  static handleLine(line: string, storyboard: Storyboard): void {
    const [key, ...values] = line.split(':').map((v) => v.trim());
    const value = values.join(' ');

    switch (key) {
      case 'UseSkinSprites':
        storyboard.useSkinSprites = value === '1';
    }
  }
}
