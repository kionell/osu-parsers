import { HitObject } from 'osu-classes';

export abstract class TaikoHitObject extends HitObject {
  /**
   * Default size of a drawable taiko hit object.
   */
  static DEFAULT_SIZE: number = Math.fround(0.475);
}
