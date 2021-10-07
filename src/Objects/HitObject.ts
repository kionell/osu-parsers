import { ControlPointInfo, BeatmapDifficultySection } from '../Beatmaps';

import { HitSample } from './Sounds/HitSample';
import { IHitObject } from './IHitObject';
import { INestedHitObject } from './INestedHitObject';
import { HitType } from './Enums/HitType';
import { HitSound } from './Enums/HitSound';

/**
 * A hit object.
 */
export abstract class HitObject implements IHitObject {
  /**
   * The base of this hit object.
   */
  base: IHitObject;

  /**
   * The status of kiai mode at the current hit object.
   */
  kiai = false;

  /**
   * Nested objects of the hit object.
   */
  nestedHitObjects: INestedHitObject[] = [];

  /**
   * Creates a new hit object based on another hit object.
   * @param hitObject A base hit object.
   */
  constructor(hitObject: IHitObject) {
    this.base = hitObject;
  }

  /**
   * The time at which hit object starts.
   */
  get startTime(): number {
    return this.base.startTime;
  }

  set startTime(value: number) {
    this.base.startTime = value;
  }

  /**
   * The hit type data of this hit object.
   */
  get hitType(): HitType {
    return this.base.hitType;
  }

  set hitType(value: HitType) {
    this.base.hitType = value;
  }

  /**
   * The hit sound data of this hit object.
   */
  get hitSound(): HitSound {
    return this.base.hitSound;
  }

  set hitSound(value: HitSound) {
    this.base.hitSound = value;
  }

  /**
   * Samples of this hit object.
   */
  get samples(): HitSample[] {
    return this.base.samples;
  }

  set samples(value: HitSample[]) {
    this.base.samples = value;
  }

  /**
   * Generates a list of nested hit objects.
   */
  createNestedHitObjects(): void {
    return;
  }

  /**
   * Applies default values to the hit object and it's nested hit objects.
   * @param controlPoints Beatmap control points.
   */
  applyDefaultsToSelf(controlPoints: ControlPointInfo): void {
    this.kiai = controlPoints.effectPointAt(this.startTime + 1).kiai;
  }

  /**
   * Applies default values to the nested hit objects.
   * @param controlPoints Beatmap control points.
   * @param difficulty Beatmap Difficulty.
   */
  applyDefaultsToNested(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    this.nestedHitObjects.forEach((n) => {
      n.applyDefaultsToSelf(controlPoints, difficulty);
    });
  }

  /**
   * Create a new copy of hit object base. 
   * @returns A clone of hit object base.
   */
  clone(): IHitObject {
    return this.base.clone();
  }
}
