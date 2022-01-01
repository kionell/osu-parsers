import { ControlPointInfo } from '../Beatmaps/ControlPoints';
import { BeatmapDifficultySection } from '../Beatmaps/Sections';
import { Vector2 } from '../Utils/Vector2';
import { HitSound } from './Enums/HitSound';
import { HitType } from './Enums/HitType';
import { IHitObject } from './IHitObject';
import { HitSample } from './Sounds/HitSample';

/**
 * An object of a parsed beatmap.
 */
export abstract class HitObject implements IHitObject {
  /**
   * The status of kiai mode at the current hit object.
   */
  kiai = false;

  /**
   * Nested objects of the hit object.
   */
  nestedHitObjects: HitObject[] = [];

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
   * Generates a list of nested hit objects.
   */
  createNestedHitObjects(): void {
    this.nestedHitObjects = [];
  }

  /**
   * Applies default values to the hit object.
   * @param controlPoints Beatmap control points.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyDefaultsToSelf(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    this.kiai = controlPoints.effectPointAt(this.startTime + 1).kiai;
  }

  /**
   * Applies default values to the nested hit objects.
   * @param controlPoints Beatmap control points.
   * @param difficulty Beatmap Difficulty.
   */
  applyDefaultsToNested(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    this.nestedHitObjects.forEach((n) => {
      n.applyDefaults(controlPoints, difficulty);
    });
  }

  /**
   * Applies default values to the hit object and it's nested hit objects.
   * @param controlPoints Beatmap control points.
   * @param difficulty Beatmap Difficulty.
   */
  applyDefaults(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void {
    this.applyDefaultsToSelf(controlPoints, difficulty);

    this.nestedHitObjects = [];

    this.createNestedHitObjects();

    this.nestedHitObjects.sort((a, b) => a.startTime - b.startTime);

    this.applyDefaultsToNested(controlPoints, difficulty);
  }

  /**
   * Create a new copy of a hit object. 
   * @returns A clone of this hit object.
   */
  abstract clone(): HitObject;
}
