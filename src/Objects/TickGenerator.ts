import { INestedEvent } from './INestedEvent';
import { ISlidableObject } from './ISlidableObject';
import { NestedType } from './Enums/NestedType';

/**
 * A tick generator for end time objects.
 */
export abstract class TickGenerator {
  /**
   * Generates ticks for an end time object.
   * @param slider A slidable object.
   * @generator
   */
  static *generateNestedEvents(slider: ISlidableObject): Generator<INestedEvent> {
    /**
     * A very lenient maximum distance of a slider for ticks to be generated.
     * This exists for edge cases such as /b/1573664
     * where the beatmap has been edited by the user,
     * and should never be reached in normal usage.
     */
    const MAX_DISTANCE = 100000;

    const sliderDistance = Math.min(MAX_DISTANCE, slider.path.distance);

    const tickDistance = Math.max(0,
      Math.min(slider.tickDistance, sliderDistance));

    const minDistanceFromEnd = slider.velocity * 10;

    let spanStartTime = slider.startTime;

    yield {
      nestedType: NestedType.Head,
      startTime: spanStartTime,
      spanStartTime,
      spanIndex: 0,
      progress: 0,
    };

    if (slider.tickDistance !== 0) {
      for (let spanIndex = 0; spanIndex < slider.spans; ++spanIndex) {
        const reversed = !!(spanIndex & 1);
        const ticks: INestedEvent[] = [];

        let distance = tickDistance;

        while (distance < sliderDistance - minDistanceFromEnd) {
          /**
           * Always generate ticks } from the start of the path rather than the span
           * to ensure that ticks in repeat spans are positioned
           * identically to those in non-repeat spans
           */
          const progress = distance / sliderDistance;
          const timeProgress = reversed ? 1 - progress : progress;

          ticks.push({
            nestedType: NestedType.Tick,
            startTime: spanStartTime + timeProgress * slider.spanDuration,
            spanStartTime,
            spanIndex,
            progress,
          });

          distance += tickDistance;
        }

        /**
         * For repeat spans, ticks are returned in reverse order,
         * which is undesirable for some rulesets
         */
        if (reversed) {
          ticks.reverse();
        }

        for (const tick of ticks) {
          yield tick;
        }

        if (spanIndex < slider.repeats) {
          yield {
            nestedType: NestedType.Repeat,
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

    const lastSpanIndex = slider.spans - 1;
    const lastSpanTime = slider.startTime + lastSpanIndex * slider.spanDuration;

    let lastTime = lastSpanTime + slider.spanDuration;

    lastTime -= slider.legacyLastTickOffset || 0;
    lastTime = Math.max(slider.startTime + totalDuration / 2, lastTime);

    let lastProgress = (lastTime - lastSpanTime) / slider.spanDuration;

    if ((slider.spans & 1) === 0) {
      lastProgress = 1 - lastProgress;
    }

    yield {
      nestedType: NestedType.LegacyLastTick,
      startTime: lastTime,
      spanStartTime: lastSpanTime,
      spanIndex: lastSpanIndex,
      progress: lastProgress,
    };

    yield {
      nestedType: NestedType.Tail,
      startTime: slider.startTime + totalDuration,
      spanStartTime: lastSpanTime,
      spanIndex: lastSpanIndex,
      progress: slider.spans % 2,
    };
  }
}
