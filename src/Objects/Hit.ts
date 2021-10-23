import { TaikoStrongHitObject } from './TaikoStrongHitObject';

import { HitType, HitSound } from 'osu-resources';

export class Hit extends TaikoStrongHitObject {
  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Normal;
  }

  get isRim(): boolean {
    return !!this.samples.find((s) => {
      return s.hitSound === HitSound[HitSound.Clap]
        || s.hitSound === HitSound[HitSound.Whistle];
    });
  }
}
