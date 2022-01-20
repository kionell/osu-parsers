import { Beatmap, BeatmapBreakEvent, EventType } from 'osu-classes';

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

    const data = line.split(',').map((v) => v.trim());

    let eventType: EventType = parseInt(data[0]);

    if (line.startsWith(' ') || line.startsWith('_')) {
      eventType = EventType.StoryboardCommand;
    }
    else {
      eventType = !isFinite(eventType)
        ? (EventType as any)[data[0]]
        : eventType;
    }

    switch (eventType) {
      case EventType.Background:
        beatmap.events.background = data[2].replace(/"/g, '');
        break;

      case EventType.Video:
        beatmap.events.videoOffset = parseInt(data[1]);
        beatmap.events.video = data[2].replace(/"/g, '');
        break;

      case EventType.Break: {
        const breakEvent = new BeatmapBreakEvent(+data[1], +data[2]);

        if (!beatmap.events.breaks) {
          beatmap.events.breaks = [];
        }

        breakEvent.startTime += offset;
        breakEvent.endTime += offset;

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
}
