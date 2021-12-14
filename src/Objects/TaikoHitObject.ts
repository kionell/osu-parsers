import { HitObject } from 'osu-classes';

export abstract class TaikoHitObject extends HitObject {
  static DEFAULT_SIZE: number = Math.fround(0.45);
}
