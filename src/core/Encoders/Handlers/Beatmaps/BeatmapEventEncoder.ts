import { EventType, IBeatmap } from 'osu-classes';
import { StoryboardEventEncoder } from '../Storyboards/StoryboardEventEncoder';

/**
 * An encoder for beatmap events.
 */
export abstract class BeatmapEventEncoder {
  /**
   * Encodes a beatmap's event section
   * @param beatmap A beatmap.
   * @returns A single string with encoded events.
   */
  static encodeEventSection(beatmap: IBeatmap): string {
    const encoded: string[] = [];

    const events = beatmap.events;

    encoded.push('[Events]');
    encoded.push('//Background and Video events');

    if (events.backgroundPath) {
      encoded.push(`0,0,"${events.backgroundPath}",0,0`);
    }

    if (events.storyboard) {
      encoded.push(StoryboardEventEncoder.encodeVideos(events.storyboard));
    }

    encoded.push('//Break Periods');

    if (events.breaks && events.breaks.length > 0) {
      events.breaks.forEach((b) => {
        encoded.push(`${EventType[EventType.Break]},${b.startTime},${b.endTime}`);
      });
    }

    if (events.storyboard) {
      encoded.push(StoryboardEventEncoder.encodeStoryboard(events.storyboard));
    }

    return encoded.join('\n');
  }
}
