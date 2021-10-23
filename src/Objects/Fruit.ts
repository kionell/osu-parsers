import { PalpableHitObject } from './PalpableHitObject';
import { HitType } from 'osu-resources';

export class Fruit extends PalpableHitObject {
  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Normal;
  }
}
