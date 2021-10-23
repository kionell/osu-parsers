import { TickGenerator, INestedHitObject } from 'osu-resources';

import { Hold } from './Hold';
import { HoldHead } from './HoldHead';
import { HoldTail } from './HoldTail';
import { HoldTick } from './HoldTick';

export class ManiaTickGenerator extends TickGenerator {
  static *generateHoldTicks(hold: Hold): Generator<INestedHitObject> {
    if (hold.tickInterval === 0) {
      return;
    }

    const head = new HoldHead(hold.clone());

    head.startTime = hold.startTime;
    head.column = hold.column;

    yield head;

    const tickInterval = hold.tickInterval;

    let time = hold.startTime + tickInterval;
    const endTime = hold.endTime - tickInterval;

    while (time <= endTime) {
      const tick = new HoldTick(hold.clone());

      tick.startTime = time;
      tick.progress = (time - hold.startTime) / hold.duration;

      yield tick;

      time += tickInterval;
    }

    const tail = new HoldTail(hold.clone());

    tail.startTime = hold.endTime;
    tail.column = hold.column;

    yield tail;
  }
}
