import {
  ControlPointGroup,
  DifficultyPoint,
  EffectPoint,
  SamplePoint,
  TimingPoint,
  IBeatmap,
  ControlPointType,
  EffectType,
  TimeSignature,
  SampleSet,
} from 'osu-classes';

/**
 * A set of control points in a group.
 */
interface IActualPoints {
  /**
   * A timing point of a group.
   */
  timingPoint: TimingPoint | null,

  /**
   * A difficulty point of a group.
   */
  difficultyPoint: DifficultyPoint | null,

  /**
   * An effect point of a group.
   */
  effectPoint: EffectPoint | null,

  /**
   * A sample point of a group.
   */
  samplePoint: SamplePoint | null,
}

/**
 * An encoder for beatmap control points.
 */
export abstract class BeatmapTimingPointEncoder {
  /**
   * The last saved difficulty point.
   */
  static lastDifficultyPoint: DifficultyPoint | null = null;

  /**
   * The last saved effect point.
   */
  static lastEffectPoint: EffectPoint | null = null;

  /**
   * The last saved sample point.
   */
  static lastSamplePoint: SamplePoint | null = null;

  /**
   * Encodes all beatmap control points.
   * @param beatmap A beatmap.
   * @returns A single string with encoded control points.
   */
  static encodeControlPoints(beatmap: IBeatmap): string {
    // Time,beatLength,meter,sampleSet,sampleIndex,volume,uninherited,effects

    const encoded: string[] = ['[TimingPoints]'];

    beatmap.controlPoints.groups.forEach((group) => {
      const points = group.controlPoints;
      const timing = (points as TimingPoint[]).find((c) => c.beatLength);

      if (timing) {
        encoded.push(this.encodeGroup(group, true));
      }

      encoded.push(this.encodeGroup(group));
    });

    return encoded.join('\n');
  }

  /**
   * Encodes control point group using only unique control points.
   * @param group A group of control points
   * @param useTiming Should we use a timing point in this group?
   * @returns Encoded group of control points. 
   */
  static encodeGroup(group: ControlPointGroup, useTiming = false): string {
    const {
      difficultyPoint,
      effectPoint,
      samplePoint,
      timingPoint,
    } = this.updateActualPoints(group);

    const startTime: number = group.startTime;
    let beatLength = -100;

    if (difficultyPoint !== null) {
      beatLength /= difficultyPoint.speedMultiplier;
    }

    let sampleSet: SampleSet = SampleSet.None;
    let customIndex = 0;
    let volume = 100;

    if (samplePoint !== null) {
      sampleSet = (SampleSet as any)[samplePoint.sampleSet];
      customIndex = samplePoint.customIndex;
      volume = samplePoint.volume;
    }

    let effects = EffectType.None;

    if (effectPoint !== null) {
      const kiai = effectPoint.kiai
        ? EffectType.Kiai
        : EffectType.None;

      const omitFirstBarLine = effectPoint.omitFirstBarLine
        ? EffectType.OmitFirstBarLine
        : EffectType.None;

      effects |= kiai | omitFirstBarLine;
    }

    let timeSignature = TimeSignature.SimpleQuadruple;
    let uninherited = 0;

    if (useTiming && timingPoint !== null) {
      beatLength = timingPoint.beatLength;
      timeSignature = timingPoint.timeSignature;
      uninherited = 1;
    }

    return [
      startTime,
      beatLength,
      timeSignature,
      sampleSet,
      customIndex,
      volume,
      uninherited,
      effects,
    ].join(',');
  }

  /**
   * Updates actual control points.
   * @param group A group of control points.
   * @returns The most actual control points.
   */
  static updateActualPoints(group: ControlPointGroup): IActualPoints {
    let timingPoint = null as (TimingPoint | null);

    group.controlPoints.forEach((point) => {
      if (point.pointType === ControlPointType.DifficultyPoint
        && !point.isRedundant(this.lastDifficultyPoint)) {
        this.lastDifficultyPoint = point as DifficultyPoint;
      }

      if (point.pointType === ControlPointType.EffectPoint
        && !point.isRedundant(this.lastEffectPoint)) {
        this.lastEffectPoint = point as EffectPoint;
      }

      if (point.pointType === ControlPointType.SamplePoint
        && !point.isRedundant(this.lastSamplePoint)) {
        this.lastSamplePoint = point as SamplePoint;
      }

      if (point.pointType === ControlPointType.TimingPoint) {
        timingPoint = point as TimingPoint;
      }
    });

    return {
      timingPoint,
      difficultyPoint: this.lastDifficultyPoint,
      effectPoint: this.lastEffectPoint,
      samplePoint: this.lastSamplePoint,
    };
  }
}
