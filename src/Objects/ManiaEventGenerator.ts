import { EventGenerator } from 'osu-resources';

import { ManiaHitObject } from './ManiaHitObject';
import { Hold } from './Hold';
import { HoldHead } from './HoldHead';
import { HoldTail } from './HoldTail';
import { HoldTick } from './HoldTick';

export class ManiaEventGenerator extends EventGenerator {
  static *generateHoldTicks(hold: Hold): Generator<ManiaHitObject> {
    if (hold.tickInterval === 0) {
      return;
    }

    const head = new HoldHead();

    head.startTime = hold.startTime;
    head.column = hold.column;

    yield head;

    const tickInterval = hold.tickInterval;

    let time = hold.startTime + tickInterval;
    const endTime = hold.endTime - tickInterval;

    while (time <= endTime) {
      const tick = new HoldTick();

      tick.startTime = time;

      yield tick;

      time += tickInterval;
    }

    const tail = new HoldTail();

    tail.startTime = hold.endTime;
    tail.column = hold.column;

    yield tail;
  }
}
