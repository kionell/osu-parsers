import { EventGenerator } from 'osu-classes';

import { TaikoHitObject } from './TaikoHitObject';
import { DrumRoll } from './DrumRoll';
import { DrumRollTick } from './DrumRollTick';
import { Swell } from './Swell';
import { SwellTick } from './SwellTick';

export class TaikoEventGenerator extends EventGenerator {
  static *generateDrumRollTicks(drumRoll: DrumRoll): Generator<TaikoHitObject> {
    if (drumRoll.tickInterval === 0) {
      return;
    }

    let firstTick = true;
    const tickInterval = drumRoll.tickInterval;

    let time = drumRoll.startTime;
    const endTime = drumRoll.endTime + tickInterval / 2;

    while (time < endTime) {
      const tick = new DrumRollTick();

      tick.startTime = time;
      tick.tickInterval = tickInterval;
      tick.firstTick = firstTick;

      tick.hitType = drumRoll.hitType;
      tick.hitSound = drumRoll.hitSound;
      tick.samples = drumRoll.samples;

      firstTick = false;

      yield tick;

      time += tickInterval;
    }
  }

  static *generateSwellTicks(swell: Swell): Generator<TaikoHitObject> {
    const requiredHits = swell.requiredHits;

    for (let hit = 0; hit < requiredHits; ++hit) {
      const tick = new SwellTick();

      tick.startTime = swell.startTime;
      tick.hitType = swell.hitType;
      tick.hitSound = swell.hitSound;
      tick.samples = swell.samples;

      yield tick;
    }
  }
}
