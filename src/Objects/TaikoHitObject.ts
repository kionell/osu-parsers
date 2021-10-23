import { HitObject } from 'osu-resources';

export abstract class TaikoHitObject extends HitObject {
  static DEFAULT_SIZE: number = Math.fround(0.45);
}
