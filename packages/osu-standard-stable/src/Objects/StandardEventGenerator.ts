import { StandardHitObject } from './StandardHitObject';
import { Slider } from './Slider';
import { SliderHead } from './SliderHead';
import { SliderTick } from './SliderTick';
import { SliderRepeat } from './SliderRepeat';
import { SliderTail } from './SliderTail';
import { Spinner } from './Spinner';
import { SpinnerTick } from './SpinnerTick';
import { SpinnerBonusTick } from './SpinnerBonusTick';

import {
  EventGenerator,
  SliderEventType,
} from 'osu-classes';

export class StandardEventGenerator extends EventGenerator {
  static *generateSliderTicks(slider: Slider): Generator<StandardHitObject> {
    for (const event of EventGenerator.generate(slider)) {
      const offset = slider.path.positionAt(event.progress);

      switch (event.eventType) {
        case SliderEventType.Head: {
          const head = new SliderHead();

          head.startPosition = slider.startPosition;
          head.startTime = event.startTime;

          yield head;

          break;
        }
        case SliderEventType.Repeat: {
          const repeat = new SliderRepeat(slider);

          repeat.repeatIndex = event.spanIndex;
          repeat.startTime = event.startTime;
          repeat.startPosition = slider.startPosition.fadd(offset);
          repeat.scale = slider.scale;

          yield repeat;

          break;
        }
        case SliderEventType.LegacyLastTick: {
          /**
           * We need to use the LegacyLastTick here 
           * for compatibility reasons (difficulty).
           * it is *okay* to use this because the TailCircle 
           * is not used for any meaningful purpose in gameplay.
           * if this is to change, we should revisit this.
           */
          const tail = new SliderTail(slider);

          tail.repeatIndex = event.spanIndex as number;
          tail.startTime = event.startTime;
          tail.startPosition = slider.endPosition;

          yield tail;

          break;
        }
        case SliderEventType.Tick: {
          const tick = new SliderTick();

          tick.spanIndex = event.spanIndex as number;
          tick.spanStartTime = event.spanStartTime as number;
          tick.startTime = event.startTime;
          tick.startPosition = slider.startPosition.fadd(offset);
          tick.scale = slider.scale;

          yield tick;
        }
      }
    }
  }

  static *generateSpinnerTicks(spinner: Spinner): Generator<StandardHitObject> {
    const totalSpins = spinner.maximumBonusSpins + spinner.spinsRequired;

    for (let i = 0; i < totalSpins; ++i) {
      const tick = i < spinner.spinsRequired
        ? new SpinnerTick()
        : new SpinnerBonusTick();

      tick.startTime = spinner.startTime + (i + 1 / totalSpins) * spinner.duration;

      yield tick;
    }
  }
}
