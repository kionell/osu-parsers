import { TickGenerator, INestedHitObject } from 'osu-resources';

import { DrumRoll } from './DrumRoll';
import { DrumRollTick } from './DrumRollTick';
import { Swell } from './Swell';
import { SwellTick } from './SwellTick';

export class TaikoTickGenerator extends TickGenerator {
  static *generateDrumRollTicks(drumRoll: DrumRoll): Generator<INestedHitObject> {
    if (drumRoll.tickInterval === 0) {
      return;
    }

    const tickInterval = drumRoll.tickInterval;
    let firstTick = true;

    let time = drumRoll.startTime;
    const endTime = drumRoll.endTime + tickInterval / 2;

    while (time < endTime) {
      const tick = new DrumRollTick(drumRoll.clone());

      tick.startTime = time;
      tick.tickInterval = tickInterval;
      tick.progress = (time - drumRoll.startTime) / drumRoll.duration;
      tick.firstTick = firstTick;

      firstTick = false;

      yield tick;

      time += tickInterval;
    }
  }

  static *generateSwellTicks(swell: Swell): Generator<INestedHitObject> {
    const requiredHits = swell.requiredHits;

    for (let hit = 0; hit < requiredHits; ++hit) {
      const nested = new SwellTick(swell.clone());

      nested.progress = hit / requiredHits;

      yield nested;
    }
  }
}
