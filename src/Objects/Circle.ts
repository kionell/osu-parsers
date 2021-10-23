import { StandardHitObject } from './StandardHitObject';

import { HitType } from 'osu-resources';

export class Circle extends StandardHitObject {
  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Normal;
  }
}
