import { DifficultyHitObject, IHitObject } from 'osu-classes';
import { PalpableHitObject } from '../../Objects';

export class CatchDifficultyHitObject extends DifficultyHitObject {
  private static _NORMALIZED_HITOBJECT_RADIUS = 41;

  /**
   * The hit object wrapped by this difficulty hit object.
   */
  baseObject: PalpableHitObject;

  /**
   * The last hit object which occurs before base object.
   */
  lastObject: PalpableHitObject;

  readonly normalizedPosition: number;
  readonly lastNormalizedPosition: number;

  /**
   * Milliseconds elapsed since the start time 
   * of the previous difficulty hit object, with a minimum of 40ms.
   */
  readonly strainTime: number;

  constructor(hitObject: IHitObject, lastObject: IHitObject, clockRate: number, halfCatcherWidth: number) {
    super(hitObject, lastObject, clockRate);

    this.baseObject = hitObject as PalpableHitObject;
    this.lastObject = lastObject as PalpableHitObject;

    /**
     * We will scale everything by this factor, 
     * so we can assume a uniform CircleSize among beatmaps.
     */
    const normalizedRadius = CatchDifficultyHitObject._NORMALIZED_HITOBJECT_RADIUS;
    const scalingFactor = Math.fround(normalizedRadius / halfCatcherWidth);

    const baseX = Math.fround(this.baseObject.effectiveX);
    const lastX = Math.fround(this.lastObject.effectiveX);

    this.normalizedPosition = Math.fround(baseX * scalingFactor);
    this.lastNormalizedPosition = Math.fround(lastX * scalingFactor);

    /**
     * Every strain interval is hard capped at the equivalent 
     * of 375 BPM streaming speed as a safety measure.
     */
    this.strainTime = Math.max(40, this.deltaTime);
  }
}
