import { ManiaHitObject } from './ManiaHitObject';
import { HitType } from 'osu-resources';

export class Note extends ManiaHitObject {
  get hitType(): HitType {
    let hitType = this.base.hitType;

    hitType &= ~HitType.Slider;
    hitType &= ~HitType.Spinner;
    hitType &= ~HitType.Hold;

    return hitType | HitType.Normal;
  }
}
