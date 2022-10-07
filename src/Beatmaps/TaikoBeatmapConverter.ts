import {
  BeatmapConverter,
  BeatmapDifficultySection,
  HitSound,
  HitType,
  IBeatmap,
  IHitObject,
  ISlidableObject,
  ISpinnableObject,
} from 'osu-classes';

import {
  TaikoHitObject,
  Hit,
  DrumRoll,
  Swell,
  TaikoStrongHitObject,
} from '../Objects';

import { TaikoBeatmap } from './TaikoBeatmap';
export class TaikoBeatmapConverter extends BeatmapConverter {
  /**
   * Osu!std is generally slower than taiko, so a factor is added to increase
   * speed. This must be used everywhere slider length or beat length is used.
   */
  static VELOCITY_MULTIPLIER = Math.fround(1.4);

  /**
   * Base osu! slider scoring distance.
   */
  static BASE_SCORING_DISTANCE = 100;

  /**
   * Because swells are easier in taiko than spinners are in osu!,
   * taiko multiplies a factor when converting the number of required hits.
   */
  static SWELL_HIT_MULTIPLIER = Math.fround(1.65);

  isForCurrentRuleset = true;

  isForManiaRuleset = false;

  taikoDistance = 0;

  taikoDuration = 0;

  tickDistance = 0;

  tickInterval = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canConvert(beatmap: IBeatmap): boolean {
    return true;
  }

  convertBeatmap(original: IBeatmap): TaikoBeatmap {
    this.isForCurrentRuleset = original.originalMode === 1;
    this.isForManiaRuleset = original.originalMode === 3;

    /**
     * Rewrite the beatmap info to add the slider velocity multiplier.
     */
    const converted = super.convertBeatmap(original) as TaikoBeatmap;

    converted.difficulty.sliderMultiplier *= TaikoBeatmapConverter.VELOCITY_MULTIPLIER;

    if (this.isForManiaRuleset) {
      /**
       * Post processing step to transform mania hit objects
       * with the same start time into strong hits.
       */
      const groups: { [key: string]: TaikoHitObject[] } = {};

      converted.hitObjects.forEach((hitObject) => {
        const key = hitObject.startTime;

        if (!groups[key]) groups[key] = [];

        groups[key].push(hitObject);
      });

      const grouped = Object.values(groups);

      converted.hitObjects = grouped.map((hitObjects) => {
        const first = hitObjects[0];

        if (hitObjects.length > 1 && first instanceof TaikoStrongHitObject) {
          first.isStrong = true;
        }

        return first;
      });
    }

    return converted;
  }

  *convertHitObjects(beatmap: IBeatmap): Generator<TaikoHitObject> {
    const hitObjects = beatmap.hitObjects;

    for (const hitObject of hitObjects) {
      if (hitObject instanceof TaikoHitObject) {
        yield hitObject;
        continue;
      }

      for (const converted of this._convertHitObject(hitObject, beatmap)) {
        yield converted;
      }
    }
  }

  private _convertHitObject(hitObject: IHitObject, beatmap: IBeatmap) {
    const slidable = hitObject as ISlidableObject;
    const spinnable = hitObject as ISpinnableObject;

    if (slidable.path) {
      return this._convertSlidableObject(slidable, beatmap);
    }

    if (typeof spinnable.endTime === 'number') {
      return this._convertSpinnableObject(spinnable, beatmap);
    }

    return this._convertHittableObject(hitObject);
  }

  private *_convertHittableObject(hittable: IHitObject): Generator<TaikoHitObject> {
    const converted = new Hit();

    converted.startTime = hittable.startTime;
    converted.hitType = HitType.Normal | (hittable.hitType & HitType.NewCombo);
    converted.hitSound = hittable.hitSound;
    converted.samples = hittable.samples;

    yield converted;
  }

  private *_convertSlidableObject(slidable: ISlidableObject, beatmap: IBeatmap): Generator<TaikoHitObject> {

    if (this._shouldConvertToHits(slidable, beatmap)) {
      const allSamples = slidable.nodeSamples;
      let sampleIndex = 0;

      let time = slidable.startTime;
      const endTime = time + this.taikoDuration + this.tickInterval / 8;

      while (time <= endTime) {
        const hit = new Hit();

        hit.startTime = time;
        hit.samples = allSamples[sampleIndex];
        hit.hitType = HitType.Normal;

        hit.hitSound = hit.samples.reduce((s, h) => {
          return s + (HitSound as any)[h.hitSound];
        }, 0);

        yield hit;

        sampleIndex = (sampleIndex + 1) % allSamples.length;

        if (this.tickInterval < 1e-7) break;

        time += this.tickInterval;
      }
    }
    else {
      const sliderTickRate = beatmap.difficulty.sliderTickRate;
      const drumRoll = new DrumRoll();

      drumRoll.duration = this.taikoDuration;
      drumRoll.tickRate = sliderTickRate === 3 ? 3 : 4;
      drumRoll.startTime = slidable.startTime;
      drumRoll.hitType = HitType.Slider | (slidable.hitType & HitType.NewCombo);
      drumRoll.hitSound = slidable.hitSound;
      drumRoll.samples = slidable.samples;

      yield drumRoll;
    }
  }

  private *_convertSpinnableObject(spinnable: IHitObject, beatmap: IBeatmap): Generator<TaikoHitObject> {
    const baseOD = beatmap.difficulty.overallDifficulty;
    const difficultyRange = BeatmapDifficultySection.range(baseOD, 3, 5, 7.5);

    const hitMultiplier = TaikoBeatmapConverter.SWELL_HIT_MULTIPLIER * difficultyRange;

    const swell = new Swell();

    swell.startTime = spinnable.startTime;
    swell.hitType = HitType.Spinner | (spinnable.hitType & HitType.NewCombo);
    swell.hitSound = spinnable.hitSound;
    swell.samples = spinnable.samples;
    swell.requiredHits = Math.trunc(Math.max(1, (swell.duration / 1000) * hitMultiplier));

    yield swell;
  }

  private _shouldConvertToHits(slidable: ISlidableObject, beatmap: IBeatmap): boolean {
    /**
     * DO NOT CHANGE OR REFACTOR ANYTHING IN HERE
     * WITHOUT TESTING AGAINST ALL BEATMAPS.
     *
     * Some of these calculations look redundant, but they are not.
     * Extremely small floating point errors are introduced
     * to maintain 1:1 compatibility with stable.
     * Rounding cannot be used as an alternative since the error deltas
     * have been observed to be between 1e-2 and 1e-6.
     */
    const timingPoint = beatmap.controlPoints.timingPointAt(slidable.startTime);
    const difficultyPoint = beatmap.controlPoints.difficultyPointAt(slidable.startTime);

    let beatLength = timingPoint.beatLength * difficultyPoint.bpmMultiplier;

    const sliderMultiplier =
      beatmap.difficulty.sliderMultiplier *
      TaikoBeatmapConverter.VELOCITY_MULTIPLIER;

    const sliderTickRate = beatmap.difficulty.sliderTickRate;

    const sliderScoringPointDistance =
      (sliderMultiplier / sliderTickRate) *
      TaikoBeatmapConverter.BASE_SCORING_DISTANCE;

    /**
     * The true distance, accounting for any repeats.
     * This ends up being the drum roll distance later
     */
    const spans = slidable.repeats + 1 || 1;

    this.taikoDistance = slidable.distance * spans
      * TaikoBeatmapConverter.VELOCITY_MULTIPLIER;

    /**
     * The velocity and duration of the taiko hit object.
     * It's calculated as the velocity of a drum roll.
     */
    const taikoVelocity = sliderScoringPointDistance * sliderTickRate;

    this.taikoDuration = Math.trunc((this.taikoDistance / taikoVelocity) * beatLength);

    if (this.isForCurrentRuleset) {
      this.tickInterval = 0;

      return false;
    }

    /**
     * In C# sources you can find the next formula: 
     *  double osuVelocity = taikoVelocity * (1000f / beatLength).
     * 
     * Idk why, but due to some .NET black magic it uses double precision.
     */
    const osuVelocity = taikoVelocity * 1000 / beatLength;

    let tickMultiplier = 1;

    /**
     * Osu-stable always uses the speed-adjusted beatlength
     * to determine the osu! velocity, but only uses it
     * for conversion if beatmap version < 8
     */
    if (beatmap.fileFormat >= 8) {
      beatLength = timingPoint.beatLength;

      tickMultiplier = 1 / difficultyPoint.speedMultiplier;
    }

    this.tickDistance = (sliderScoringPointDistance / sliderTickRate) * tickMultiplier;

    /**
     * If the drum roll is to be split into hit circles,
     * assume the ticks are 1/8 spaced within the duration of one beat.
     */
    this.tickInterval = Math.min(beatLength / sliderTickRate, this.taikoDuration / spans);

    return (
      this.tickInterval > 0 && (this.taikoDistance / osuVelocity) * 1000 < 2 * beatLength
    );
  }

  createBeatmap(): TaikoBeatmap {
    return new TaikoBeatmap();
  }
}
