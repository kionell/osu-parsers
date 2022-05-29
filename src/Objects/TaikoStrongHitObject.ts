import { TaikoHitObject } from './TaikoHitObject';

import { HitSound } from 'osu-classes';

export abstract class TaikoStrongHitObject extends TaikoHitObject {
  /**
   * Scale multiplier for a strong drawable taiko hit object.
   */
  static STRONG_SCALE: number = Math.fround(1.4);

  /**
   * Default size of a strong drawable taiko hit object.
   */
  static DEFAULT_STRONG_SIZE: number = TaikoHitObject.DEFAULT_SIZE * TaikoStrongHitObject.STRONG_SCALE;

  /**
   * Whether this HitObject is a "strong" type.
   * Strong hit objects give more points for hitting the hit object with both keys.
   */
  get isStrong(): boolean {
    return !!this.samples.find((s) => {
      return s.hitSound === HitSound[HitSound.Finish];
    });
  }

  set isStrong(value: boolean) {
    if (this.samples.length > 0) {
      this.samples[0].hitSound = HitSound[value ? HitSound.Finish : HitSound.Normal];
    }
  }
}
