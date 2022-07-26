import { IBeatmap } from 'osu-classes';

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
    const storyboard = events.storyboard;

    encoded.push('[Events]');

    encoded.push('//Background and Video events');

    if (events.background) {
      encoded.push(`0,0,"${events.background}",0,0`);
    }

    if (events.video) {
      encoded.push(`Video,${events.videoOffset},"${events.video}"`);
    }

    encoded.push('//Break Periods');

    if (events.breaks && events.breaks.length > 0) {
      events.breaks.forEach((b) => {
        encoded.push(`2,${b.startTime},${b.endTime}`);
      });
    }

    encoded.push('//Storyboard Layer 0 (Background)');

    if (storyboard && storyboard.background.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.background));
    }

    encoded.push('//Storyboard Layer 1 (Fail)');

    if (storyboard && storyboard.fail.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.fail));
    }

    encoded.push('//Storyboard Layer 2 (Pass)');

    if (storyboard && storyboard.pass.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.pass));
    }

    encoded.push('//Storyboard Layer 3 (Foreground)');

    if (storyboard && storyboard.foreground.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.foreground));
    }

    encoded.push('//Storyboard Layer 4 (Overlay)');

    if (storyboard && storyboard.overlay.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.overlay));
    }

    encoded.push('//Storyboard Sound Samples');

    if (storyboard && storyboard.samples.length > 0) {
      encoded.push(EventsEncoder.encodeStoryboardLayer(storyboard.samples));
    }

    return encoded.join('\n');
  }
  }
}
