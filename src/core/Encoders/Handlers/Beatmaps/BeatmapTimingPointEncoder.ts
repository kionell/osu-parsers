import {
  ControlPointGroup,
  DifficultyPoint,
  SamplePoint,
  IBeatmap,
  EffectType,
  TimeSignature,
  SampleSet,
  IHitObject,
  ControlPointInfo,
  IHasSliderVelocity,
  IHasDuration,
  IHasNestedHitObjects,
  HitSample,
  TimingPoint,
} from 'osu-classes';

import { BeatmapHitObjectEncoder } from './BeatmapHitObjectEncoder';

/**
 * An encoder for beatmap control points.
 */
export abstract class BeatmapTimingPointEncoder {
  private static _controlPoints: ControlPointInfo;
  private static _lastControlPointProperties: LegacyControlPointProperties;
  private static _lastRelevantSamplePoint: SamplePoint | null;
  private static _lastRelevantDifficultyPoint: DifficultyPoint | null;

  /**
   * Encodes all beatmap control points.
   * @param beatmap A beatmap.
   * @returns A single string with encoded control points.
   */
  static encodeControlPoints(beatmap: IBeatmap): string {
    // Time,beatLength,meter,sampleSet,sampleIndex,volume,uninherited,effects

    const encoded: string[] = ['[TimingPoints]'];

    this._controlPoints = new ControlPointInfo();

    beatmap.controlPoints.allPoints.forEach((controlPoint) => {
      this._controlPoints.add(controlPoint, controlPoint.startTime);
    });

    this._lastRelevantSamplePoint = null;
    this._lastRelevantDifficultyPoint = null;

    /**
     * In osu!taiko and osu!mania, a scroll speed is stored 
     * as "slider velocity" in legacy formats.
     * In that case, a scrolling speed change is a global effect 
     * and per-hit object difficulty control points are ignored.
     */
    const isTaikoBeatmap = beatmap.mode === 1;
    const isManiaBeatmap = beatmap.mode === 3;

    const scrollSpeedEncodedAsSliderVelocity = isTaikoBeatmap || isManiaBeatmap;

    /**
     * Iterate over hit objects and pull out all required sample and difficulty changes.
     */
    if (!scrollSpeedEncodedAsSliderVelocity) {
      this._extractDifficultyPoints(beatmap.hitObjects);
    }

    this._extractSamplePoints(beatmap.hitObjects);

    if (scrollSpeedEncodedAsSliderVelocity) {
      for (const point of this._controlPoints.effectPoints) {
        const difficultyPoint = new DifficultyPoint();

        difficultyPoint.sliderVelocity = point.scrollSpeed;

        this._controlPoints.add(difficultyPoint, point.startTime);
      }
    }

    this._lastControlPointProperties = new LegacyControlPointProperties();

    for (const group of this._controlPoints.groups) {
      const encodedGroup = this._encodeControlPointGroup(group);

      if (encodedGroup.length > 0) {
        encoded.push(encodedGroup);
      }
    }

    return encoded.join('\n');
  }

  private static _encodeControlPointGroup(group: ControlPointGroup): string {
    const encoded: string[] = [];

    const timingPoint = group.controlPoints.find((c) => c instanceof TimingPoint);
    const controlPointProperties = this._getLegacyControlPointProperties(
      group,
      timingPoint instanceof TimingPoint,
    );

    /**
     * If the group contains a timing control point, it needs to be output separately.
     */
    if (timingPoint instanceof TimingPoint) {
      encoded.push([
        `${timingPoint.startTime}`,
        `${timingPoint.beatLength}`,
        this._outputControlPointAt(controlPointProperties, true),
      ].join(','));

      this._lastControlPointProperties = controlPointProperties;
      this._lastControlPointProperties.sliderVelocity = 1;
    }

    if (controlPointProperties.isRedundant(this._lastControlPointProperties)) {
      return encoded.join('\n');
    }

    /**
     * Output any remaining effects as secondary non-timing control point.
     */
    encoded.push([
      `${group.startTime}`,
      `${-100 / controlPointProperties.sliderVelocity}`,
      this._outputControlPointAt(controlPointProperties, false),
    ].join(','));

    this._lastControlPointProperties = controlPointProperties;

    return encoded.join('\n');
  }

  private static _outputControlPointAt(
    controlPointProperties: LegacyControlPointProperties,
    isTimingPoint: boolean,
  ): string {
    return [
      `${controlPointProperties.timingSignature}`,
      `${controlPointProperties.sampleBank}`,
      `${controlPointProperties.customSampleBank}`,
      `${controlPointProperties.sampleVolume}`,
      isTimingPoint ? '1' : '0',
      `${controlPointProperties.effectFlags}`,
    ].join(',');
  }

  private static _collectDifficultyPoints(hitObjects: IHitObject[]): DifficultyPoint[] {
    const difficultyPoints: DifficultyPoint[] = [];

    for (const hitObject of hitObjects) {
      const velocityObject = hitObject as IHitObject & IHasSliderVelocity;

      if (typeof velocityObject.sliderVelocity === 'number') {
        const difficultyPoint = new DifficultyPoint();

        difficultyPoint.startTime = velocityObject.startTime;
        difficultyPoint.sliderVelocity = velocityObject.sliderVelocity;

        difficultyPoints.push(difficultyPoint);
      }
    }

    return difficultyPoints.sort((a, b) => a.startTime - b.startTime);
  }

  private static _extractDifficultyPoints(hitObjects: IHitObject[]): void {
    for (const difficultyPoint of this._collectDifficultyPoints(hitObjects)) {
      if (!difficultyPoint.isRedundant(this._lastRelevantDifficultyPoint)) {
        this._controlPoints.add(difficultyPoint, difficultyPoint.startTime);
        this._lastRelevantDifficultyPoint = difficultyPoint;
      }
    }
  }

  private static _collectSamplePoints(hitObjects: IHitObject[]): SamplePoint[] {
    const samplePoints: SamplePoint[] = [];

    for (const hitObject of hitObjects) {
      if (hitObject.samples.length > 0) {
        const [volume, customIndex] = hitObject.samples.reduce((p, s) => {
          p[0] = Math.max(p[0], s.volume);
          p[1] = Math.max(p[1], s.customSampleBank);

          return p;
        }, [0, -1]);

        const samplePoint = new SamplePoint();

        const durationObject = hitObject as IHitObject & IHasDuration;

        samplePoint.startTime = durationObject.endTime ?? hitObject.startTime;
        samplePoint.volume = volume;
        samplePoint.customSampleBank = customIndex;

        samplePoints.push(samplePoint);
      }

      const obj = hitObject as IHitObject & IHasNestedHitObjects;

      for (const samplePoint of this._collectSamplePoints(obj.nestedHitObjects)) {
        samplePoints.push(samplePoint);
      }
    }

    return samplePoints.sort((a, b) => a.startTime - b.startTime);
  }

  private static _extractSamplePoints(hitObjects: IHitObject[]): void {
    for (const samplePoint of this._collectSamplePoints(hitObjects)) {
      if (!samplePoint.isRedundant(this._lastRelevantSamplePoint)) {
        this._controlPoints.add(samplePoint, samplePoint.startTime);
        this._lastRelevantSamplePoint = samplePoint;
      }
    }
  }

  private static _getLegacyControlPointProperties(
    group: ControlPointGroup,
    updateSampleBank: boolean,
  ): LegacyControlPointProperties {
    const timingPoint = this._controlPoints.timingPointAt(group.startTime);
    const difficultyPoint = this._controlPoints.difficultyPointAt(group.startTime);
    const samplePoint = this._controlPoints.samplePointAt(group.startTime);
    const effectPoint = this._controlPoints.effectPointAt(group.startTime);

    /**
     * Apply the control point to a hit sample to uncover legacy properties (e.g. suffix)
     */
    const tempHitSample = samplePoint.applyTo(new HitSample({
      bank: samplePoint.bank,
      volume: samplePoint.volume,
      customSampleBank: samplePoint.customSampleBank,
    }));

    const customSampleBank = BeatmapHitObjectEncoder.toLegacyCustomSampleBank(tempHitSample);

    /**
     * Convert effect flags to the legacy format.
     */
    let effectFlags = EffectType.None;

    if (effectPoint.kiai) {
      effectFlags |= EffectType.Kiai;
    }

    if (timingPoint.omitFirstBarLine) {
      effectFlags |= EffectType.OmitFirstBarLine;
    }

    return new LegacyControlPointProperties({
      sliderVelocity: difficultyPoint.sliderVelocity,
      timingSignature: timingPoint.timeSignature,
      sampleBank: updateSampleBank
        ? BeatmapHitObjectEncoder.toLegacySampleBank(tempHitSample.bank)
        : this._lastControlPointProperties.sampleBank,

      /**
       * Inherit the previous custom sample bank 
       * if the current custom sample bank is not set
       */
      customSampleBank: customSampleBank >= 0
        ? customSampleBank
        : this._lastControlPointProperties.customSampleBank,

      sampleVolume: tempHitSample.volume,
      effectFlags,
    });
  }
}

class LegacyControlPointProperties {
  sliderVelocity: number;
  timingSignature: TimeSignature;
  sampleBank: SampleSet;
  customSampleBank: number;
  sampleVolume: number;
  effectFlags: EffectType;

  constructor(options?: Partial<LegacyControlPointProperties>) {
    this.sliderVelocity = options?.sliderVelocity ?? 1;
    this.timingSignature = options?.timingSignature ?? TimeSignature.SimpleQuadruple;
    this.sampleBank = options?.sampleBank ?? SampleSet.None;
    this.customSampleBank = options?.customSampleBank ?? 0;
    this.sampleVolume = options?.sampleVolume ?? 100;
    this.effectFlags = options?.effectFlags ?? EffectType.None;
  }

  isRedundant(other: LegacyControlPointProperties): boolean {
    return this.sliderVelocity === other.sliderVelocity
      && this.timingSignature === other.timingSignature
      && this.sampleBank === other.sampleBank
      && this.customSampleBank === other.customSampleBank
      && this.sampleVolume === other.sampleVolume
      && this.effectFlags === other.effectFlags;
  }
}
