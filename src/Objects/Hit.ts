import { TaikoStrongHitObject } from './TaikoStrongHitObject';
import { HitSound } from 'osu-classes';

export class Hit extends TaikoStrongHitObject {
  get isRim(): boolean {
    return !!this.samples.find((s) => {
      return s.hitSound === HitSound[HitSound.Clap]
        || s.hitSound === HitSound[HitSound.Whistle];
    });
  }

  clone(): Hit {
    const cloned = new Hit();

    cloned.startPosition = this.startPosition.clone();
    cloned.startTime = this.startTime;
    cloned.hitType = this.hitType;
    cloned.hitSound = this.hitSound;
    cloned.samples = this.samples.map((s) => s.clone());
    cloned.kiai = this.kiai;

    return cloned;
  }
}
