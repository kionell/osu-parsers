import {
  Vector2,
  HitType,
  HitSample,
  HitSound,
  IHitObject,
} from 'osu-resources';

/**
 * An object of a parsed beatmap.
 */
export abstract class ParsedHitObject implements IHitObject {
  /**
   * The time at which the hit object starts.
   */
  startTime = 0;

  /**
   * Parsed hit type data of a hit object.
   */
  hitType: HitType = HitType.Normal;

  /**
   * Parsed hit sound data of a hit object.
   */
  hitSound: HitSound = HitSound.Normal;

  /**
   * The samples to be played when this hit object is hit.
   */
  samples: HitSample[] = [];

  /**
   * The position at which the hit object starts.
   */
  startPosition: Vector2 = new Vector2(0, 0);

  /**
   * The starting X-position of this hit object.
   */
  get startX(): number {
    return this.startPosition.x;
  }

  set startX(value: number) {
    this.startPosition.x = value;
  }

  /**
   * The starting Y-position of this hit object.
   */
  get startY(): number {
    return this.startPosition.y;
  }

  set startY(value: number) {
    this.startPosition.y = value;
  }

  /**
   * The position at which the hit object ends.
   */
  get endPosition(): Vector2 {
    return this.startPosition;
  }

  abstract clone(): ParsedHitObject;
}
