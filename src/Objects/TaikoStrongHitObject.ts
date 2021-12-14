import { TaikoHitObject } from './TaikoHitObject';

import { HitSound } from 'osu-classes';

export abstract class TaikoStrongHitObject extends TaikoHitObject {
  static STRONG_SCALE: number = Math.fround(1.4);

  static DEFAULT_STRONG_SIZE: number = TaikoHitObject.DEFAULT_SIZE * TaikoStrongHitObject.STRONG_SCALE;

  get isStrong(): boolean {
    return !!this.samples.find((s) => {
      return s.hitSound === HitSound[HitSound.Finish];
    });
  }
}
