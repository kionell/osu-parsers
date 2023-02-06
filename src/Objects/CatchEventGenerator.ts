import { CatchHitObject } from './CatchHitObject';
import type { JuiceStream } from './JuiceStream';
import { JuiceFruit } from './JuiceFruit';
import { JuiceDroplet } from './JuiceDroplet';
import { JuiceTinyDroplet } from './JuiceTinyDroplet';
import { BananaShower } from './BananaShower';
import { Banana } from './Banana';

import {
  EventGenerator,
  ISliderEventDescriptor,
  MathUtils,
  SliderEventType,
} from 'osu-classes';

export class CatchEventGenerator extends EventGenerator {
  static *generateDroplets(stream: JuiceStream): Generator<CatchHitObject> {
    let lastEvent: ISliderEventDescriptor | null = null;

    for (const event of EventGenerator.generate(stream)) {
      /**
       * Generate tiny droplets since the last point
       */
      if (lastEvent !== null) {
        const sinceLastTick = event.startTime - lastEvent.startTime;

        if (sinceLastTick > 80) {
          let timeBetweenTiny = sinceLastTick;

          while (timeBetweenTiny > 100) {
            timeBetweenTiny /= 2;
          }

          let time = timeBetweenTiny;
          const endTime = sinceLastTick;

          while (time < endTime) {
            const startTime = time + lastEvent.startTime;
            const offset = lastEvent.progress +
              (time / sinceLastTick) * (event.progress - lastEvent.progress);

            const droplet = new JuiceTinyDroplet();

            droplet.startTime = startTime;
            droplet.startX = this.clampToPlayfield(
              stream.effectiveX + stream.path.positionAt(offset).x,
            );

            yield droplet;

            time += timeBetweenTiny;
          }
        }
      }

      /**
       * This also includes LegacyLastTick and this is used for
       * JuiceDroplet generation above.This means that the final segment
       * of JuiceDroplets are increasingly mistimed where
       * LegacyLastTickOffset is being applied.
       */
      lastEvent = event;

      let nested: JuiceFruit | JuiceDroplet;

      switch (event.eventType) {
        case SliderEventType.Head:
        case SliderEventType.Repeat:
        case SliderEventType.Tail:
          nested = new JuiceFruit();

          nested.startTime = event.startTime;
          nested.startX = this.clampToPlayfield(
            stream.effectiveX + stream.path.positionAt(event.progress).x,
          );

          yield nested;

          break;

        case SliderEventType.Tick:
          nested = new JuiceDroplet();

          nested.startTime = event.startTime;
          nested.startX = this.clampToPlayfield(
            stream.effectiveX + stream.path.positionAt(event.progress).x,
          );

          yield nested;
      }
    }
  }

  static *generateBananas(shower: BananaShower): Generator<CatchHitObject> {
    let tickInterval = shower.duration;

    while (tickInterval > 100) {
      tickInterval /= 2;
    }

    if (tickInterval <= 0) {
      return;
    }

    const endTime = shower.endTime;
    let time = shower.startTime;
    let index = -1;

    while (time <= endTime) {
      const banana = new Banana();

      banana.startTime = time;
      banana.index = ++index;

      yield banana;

      time += tickInterval;
    }
  }

  static clampToPlayfield(value: number): number {
    const PLAYFIELD_WIDTH = 512;

    return MathUtils.clamp(value, 0, PLAYFIELD_WIDTH);
  }
}
