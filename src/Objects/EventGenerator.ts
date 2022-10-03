import { ISlidableObject } from './ISlidableObject';
import { SliderEventType } from './Enums/SliderEventType';
import { clamp } from '../Utils/MathUtils';

/**
 * A tick generator for end time objects.
 */
export abstract class EventGenerator {
  /**
   * A very lenient maximum distance of a slider for ticks to be generated.
   * This exists for edge cases such as /b/1573664
   * where the beatmap has been edited by the user,
   * and should never be reached in normal usage.
   */
  static SLIDER_MAX_DISTANCE = 100000;

  /**
   * Generates ticks for an end time object.
   * @param slider A slidable object.
   * @generator
   */
  static *generate(slider: ISlidableObject): Generator<ISliderEventDescriptor> {
    const sliderDistance = Math.min(this.SLIDER_MAX_DISTANCE, slider.path.distance);
    const tickDistance = clamp(slider.tickDistance || 0, 0, sliderDistance);

    const minDistanceFromEnd = slider.velocity * 10;

    let spanStartTime = slider.startTime;

    yield {
      eventType: SliderEventType.Head,
      startTime: spanStartTime,
      spanStartTime,
      spanIndex: 0,
      progress: 0,
    };

    if (slider.tickDistance !== 0) {
      for (let spanIndex = 0; spanIndex < slider.spans; ++spanIndex) {
        const reversed = !!(spanIndex & 1);
        const events: ISliderEventDescriptor[] = [];

        let distance = tickDistance;

        while (distance < sliderDistance - minDistanceFromEnd) {
          /**
           * Always generate events from the start of the path rather than the span
           * to ensure that events in repeat spans are positioned
           * identically to those in non-repeat spans
           */
          const progress = distance / sliderDistance;
          const timeProgress = reversed ? 1 - progress : progress;

          events.push({
            eventType: SliderEventType.Tick,
            startTime: spanStartTime + timeProgress * slider.spanDuration,
            spanStartTime,
            spanIndex,
            progress,
          });

          distance += tickDistance;
        }

        /**
         * For repeat spans, events are returned in reverse order,
         * which is undesirable for some rulesets
         */
        if (reversed) events.reverse();

        for (const event of events) {
          yield event;
        }

        if (spanIndex < slider.repeats) {
          yield {
            eventType: SliderEventType.Repeat,
            startTime: spanStartTime + slider.spanDuration,
            spanStartTime,
            spanIndex,
            progress: (spanIndex + 1) & 1,
          };
        }

        spanStartTime += slider.spanDuration;
      }
    }

    const totalDuration = slider.spans * slider.spanDuration;

    const finalSpanIndex = slider.spans - 1;
    const finalSpanStartTime = slider.startTime + finalSpanIndex * slider.spanDuration;

    const finalSpanEndTime = Math.max(
      slider.startTime + totalDuration / 2,
      finalSpanStartTime + slider.spanDuration - (slider.legacyLastTickOffset || 0),
    );

    let finalProgress = (finalSpanEndTime - finalSpanStartTime) / slider.spanDuration;

    if ((slider.spans & 1) === 0) {
      finalProgress = 1 - finalProgress;
    }

    yield {
      eventType: SliderEventType.LegacyLastTick,
      startTime: finalSpanEndTime,
      spanStartTime: finalSpanStartTime,
      spanIndex: finalSpanIndex,
      progress: finalProgress,
    };

    yield {
      eventType: SliderEventType.Tail,
      startTime: slider.startTime + totalDuration,
      spanStartTime: finalSpanStartTime,
      spanIndex: finalSpanIndex,
      progress: slider.spans % 2,
    };
  }
}

/**
 * A nested event.
 */
export interface ISliderEventDescriptor {
  /**
   * The type of event.
   */
  eventType: SliderEventType;

  /**
   * The zero-based index of the span. In the case of repeat sliders, 
   * this will increase after each slider repeat.
   */
  spanIndex: number;

  /**
   * The time at which the contained span index begins.
   */
  spanStartTime: number;

  /**
   * The time at which this nested event starts.
   */
  startTime: number;

  /**
   * The progress along the slider's path at which this event occurs.
   */
  progress: number;
}
