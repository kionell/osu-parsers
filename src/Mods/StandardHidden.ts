import { Hidden, IApplicableToBeatmap } from 'osu-classes';
import { StandardBeatmap } from '../Beatmaps';
import { StandardHitObject } from '../Objects';

export class StandardHidden extends Hidden implements IApplicableToBeatmap {
  static readonly FADE_IN_DURATION_MULTIPLIER = 0.4;
  static readonly FADE_OUT_DURATION_MULTIPLIER = 0.3;

  applyToBeatmap(beatmap: StandardBeatmap): void {
    for (const hitObject of beatmap.hitObjects) {
      this._applyFadeAdjustments(hitObject);
    }
  }

  private _applyFadeAdjustments(hitObject: StandardHitObject): void {
    hitObject.timeFadeIn = hitObject.timePreempt * StandardHidden.FADE_IN_DURATION_MULTIPLIER;

    for (const nestedObject of hitObject.nestedHitObjects) {
      this._applyFadeAdjustments(nestedObject as StandardHitObject);
    }
  }
}
