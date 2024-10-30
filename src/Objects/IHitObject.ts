import { HitSample } from './Sounds/HitSample';
import { HitType } from './Enums/HitType';
import { HitSound } from './Enums/HitSound';
import { HitWindows } from '../Scoring';

/**
 * A hit object.
 */
export interface IHitObject {
  /**
   * The time at which hit object starts.
   */
  startTime: number;

  /**
   * Hit type data of this hit object.
   */
  hitType: HitType;

  /**
   * Hit sound data of this hit object.
   */
  hitSound: HitSound;

  /**
   * Samples of this hit object.
   */
  samples: HitSample[];

  /**
   * Hit windows of this hit object.
   */
  hitWindows: HitWindows;

  /**
   * Creates a new copy of this hit object.
   * @returns a copy of this hit object.
   */
  clone(): IHitObject;
}
