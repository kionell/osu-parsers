import { Slider } from './Slider';
import { SliderHead } from './SliderHead';
import { SliderTick } from './SliderTick';
import { SliderRepeat } from './SliderRepeat';
import { SliderTail } from './SliderTail';

import { Spinner } from './Spinner';
import { SpinnerTick } from './SpinnerTick';
import { SpinnerBonusTick } from './SpinnerBonusTick';

import {
  TickGenerator,
  NestedType,
  INestedHitObject,
} from 'osu-resources';

export class StandardTickGenerator extends TickGenerator {
  static *generateSliderTicks(slider: Slider): Generator<INestedHitObject> {
    for (const event of TickGenerator.generateNestedEvents(slider)) {
      const offset = slider.path.positionAt(event.progress);

      switch (event.nestedType) {
        case NestedType.Head: {
          const head = new SliderHead(slider.clone());

          head.startPosition = head.startPosition.add(offset);
          head.spanStartTime = event.spanStartTime as number;
          head.startTime = event.startTime;

          yield head;

          break;
        }

        case NestedType.Repeat: {
          const repeat = new SliderRepeat(slider.clone(), slider);

          repeat.startPosition = repeat.startPosition.add(offset);
          repeat.repeatIndex = event.spanIndex as number;
          repeat.spanIndex = event.spanIndex as number;
          repeat.spanStartTime = event.spanStartTime as number;
          repeat.startTime = event.startTime;
          repeat.progress = event.progress;

          yield repeat;

          break;
        }

        case NestedType.Tail: {
          const tail = new SliderTail(slider.clone(), slider);

          tail.startPosition = tail.startPosition.add(offset);
          tail.repeatIndex = event.spanIndex as number;
          tail.spanIndex = event.spanIndex as number;
          tail.spanStartTime = event.spanStartTime as number;
          tail.startTime = event.startTime;

          yield tail;

          break;
        }

        case NestedType.Tick: {
          const tick = new SliderTick(slider.clone());

          tick.startPosition = tick.startPosition.add(offset);
          tick.spanIndex = event.spanIndex as number;
          tick.spanStartTime = event.spanStartTime as number;
          tick.startTime = event.startTime;
          tick.progress = event.progress;

          yield tick;
        }
      }
    }
  }

  static *generateSpinnerTicks(spinner: Spinner): Generator<INestedHitObject> {
    const totalSpins = spinner.maximumBonusSpins + spinner.spinsRequired;

    for (let i = 0; i < totalSpins; ++i) {
      const nested = i < spinner.spinsRequired
        ? new SpinnerTick(spinner.clone())
        : new SpinnerBonusTick(spinner.clone());

      nested.startTime = spinner.startTime + (i + 1 / totalSpins) * spinner.duration;

      nested.progress = Math.min(1, (i + 1) / spinner.spinsRequired);

      yield nested;
    }
  }
}
