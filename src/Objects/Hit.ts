import { TaikoStrongHitObject } from './TaikoStrongHitObject';
import { HitSound } from 'osu-classes';

export class Hit extends TaikoStrongHitObject {
  get isRim(): boolean {
    return !!this.samples.find((s) => {
      return s.hitSound === HitSound[HitSound.Clap]
        || s.hitSound === HitSound[HitSound.Whistle];
    });
  }
}
