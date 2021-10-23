import { ControlPointInfo, BeatmapDifficultySection } from '../Beatmaps';

import { IHitObject } from './IHitObject';
import { INestedEvent } from './INestedEvent';

/**
 * A nested hit object.
 */
export interface INestedHitObject extends IHitObject, INestedEvent {
  /**
   * Applies default values to the nested hit object.
   * @param controlPoints Beatmap control points.
   * @param difficulty The beatmap difficulty.
   */
  applyDefaults(controlPoints: ControlPointInfo, difficulty: BeatmapDifficultySection): void;
}
