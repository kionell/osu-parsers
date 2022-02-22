import { Beatmap, BeatmapBreakEvent, EventType } from 'osu-classes';
import { Parsing } from '../../../Utils';

/**
 * A decoder for beatmap events.
 */
export abstract class EventHandler {
  /**
   * Decodes event line.
   * If line contains any beatmap events, then it is added to the beatmap.
   * Storyboard lines are added to the array and remain unchanged.
   * @param line Beatmap event line.
   * @param beatmap Beatmap to which the event data will be added.
   * @param sbLines Array for storing storyboard lines.
   * @param offset The offset to apply to all time values.
   */
  static handleLine(line: string, beatmap: Beatmap, sbLines: string[] | null, offset: number): void {
    // EventType,startTime,eventParams

    const data = line.split(',').map((v, i) => i ? v.trim() : v);

    const eventType = this._getEventType(data[0]);

    switch (eventType) {
      case EventType.Background:
        beatmap.events.background = data[2].replace(/"/g, '');
        break;

      case EventType.Video:
        beatmap.events.videoOffset = Parsing.parseInt(data[1]);
        beatmap.events.video = data[2].replace(/"/g, '');
        break;

      case EventType.Break: {
        const start = Parsing.parseFloat(data[1]) + offset;
        const end = Math.max(start, Parsing.parseFloat(data[2]) + offset);

        const breakEvent = new BeatmapBreakEvent(start, end);

        if (!beatmap.events.breaks) {
          beatmap.events.breaks = [];
        }

        beatmap.events.breaks.push(breakEvent);
        break;
      }

      case EventType.Sample:
      case EventType.Sprite:
      case EventType.Animation:
      case EventType.StoryboardCommand:
        if (sbLines) sbLines.push(line);
    }
  }

  private static _getEventType(input: string): EventType {
    if (input.startsWith(' ') || input.startsWith('_')) {
      return EventType.StoryboardCommand;
    }

    input = input.trim();

    let eventType = parseInt(input);

    eventType = isFinite(eventType) ? eventType : (EventType as any)[input];

    if (EventType[eventType]) return eventType;

    throw new Error(`Unknown event type: ${input}!`);
  }
}
