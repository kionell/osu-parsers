import { JuiceStream } from './JuiceStream';
import { JuiceFruit } from './JuiceFruit';
import { JuiceDrop } from './JuiceDrop';
import { JuiceDroplet } from './JuiceDroplet';

import { BananaShower } from './BananaShower';
import { Banana } from './Banana';

import {
  TickGenerator,
  INestedHitObject,
  INestedEvent,
  NestedType,
} from 'osu-resources';

export class CatchTickGenerator extends TickGenerator {
  static *generateDroplets(stream: JuiceStream): Generator<INestedHitObject> {
    let lastEvent: INestedEvent | null = null;

    for (const event of TickGenerator.generateNestedEvents(stream)) {
      // Generate tiny droplets since the last point
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
            const offset =
              lastEvent.progress +
              (time / sinceLastTick) * (event.progress - lastEvent.progress);

            const droplet = new JuiceDroplet(stream.clone());

            droplet.startTime = startTime;

            droplet.progress = (startTime - stream.startTime) / stream.duration;

            droplet.startX =
              stream.originalX + stream.path.positionAt(offset).x;

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

      let nested: JuiceFruit | JuiceDrop;

      switch (event.nestedType) {
        case NestedType.Head:
        case NestedType.Repeat:
        case NestedType.Tail:
          nested = new JuiceFruit(stream.clone());

          nested.startTime = event.startTime;
          nested.startX =
            stream.originalX + stream.path.positionAt(event.progress).x;

          yield nested;

          break;

        case NestedType.Tick:
          nested = new JuiceDrop(stream.clone());

          nested.startTime = event.startTime;
          nested.startX =
            stream.originalX + stream.path.positionAt(event.progress).x;

          yield nested;
      }
    }
  }

  static *generateBananas(shower: BananaShower): Generator<INestedHitObject> {
    let tickInterval = shower.duration;

    while (tickInterval > 100) {
      tickInterval /= 2;
    }

    if (tickInterval <= 0) {
      return;
    }

    let time = shower.startTime;
    const endTime = shower.endTime;
    let index = -1;

    while (time <= endTime) {
      const tick = new Banana(shower.clone());

      tick.startTime = time;
      tick.bananaIndex = ++index;
      tick.progress = (time - shower.startTime) / shower.duration;

      yield tick;

      time += tickInterval;
    }
  }
}
