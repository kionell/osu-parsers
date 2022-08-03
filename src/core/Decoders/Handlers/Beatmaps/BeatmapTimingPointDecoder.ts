import {
  ControlPointInfo,
  ControlPoint,
  DifficultyPoint,
  EffectPoint,
  SamplePoint,
  TimingPoint,
  ControlPointType,
  EffectType,
  TimeSignature,
  SampleSet,
  Beatmap,
} from 'osu-classes';

import { Parsing } from '../../../Utils/Parsing';

/**
 * A decoder for beatmap control points.
 */
export abstract class BeatmapTimingPointDecoder {
  /**
   * The time for the next flush of control points.
   */
  static pendingTime = 0;

  /**
   * Types of control points that will be flushed.
   */
  static pendingTypes: ControlPointType[] = [];

  /**
   * Control points that will be flushed.
   */
  static pendingPoints: ControlPoint[] = [];

  /**
   * Information about all control points of a beatmap.
   */
  static controlPoints: ControlPointInfo;

  /**
   * Decodes timing point line and adds control points to a beatmap.
   * @param line A timing point line.
   * @param beatmap A parsed beatmap.
   * @param offset The offset to apply to all time values.
   */
  static handleLine(line: string, beatmap: Beatmap, offset: number): void {
    // Time,beatLength,meter,sampleSet,sampleIndex,volume,uninherited,effects

    this.controlPoints = beatmap.controlPoints;

    const data = line.split(',');

    let timeSignature = TimeSignature.SimpleQuadruple;
    let sampleSet = SampleSet[SampleSet.None];
    let customIndex = 0;
    let volume = 100;
    let timingChange = true;
    let effects = EffectType.None;

    if (data.length > 2) {
      switch (data.length) {
        default:
        case 8: effects = Parsing.parseInt(data[7]);
        case 7: timingChange = data[6] === '1';
        case 6: volume = Parsing.parseInt(data[5]);
        case 5: customIndex = Parsing.parseInt(data[4]);
        case 4: sampleSet = SampleSet[Parsing.parseInt(data[3])];
        case 3: timeSignature = Parsing.parseInt(data[2]);
      }
    }

    if (timeSignature < 1) {
      throw new Error('The numerator of a time signature must be positive.');
    }

    const beatLength = Parsing.parseFloat(data[1]);
    const startTime = Parsing.parseFloat(data[0]) + offset;

    let bpmMultiplier = 1;
    let speedMultiplier = 1;

    if (beatLength < 0) {
      speedMultiplier = 100 / -beatLength;
      bpmMultiplier = Math.min(Math.fround(-beatLength), 10000);
      bpmMultiplier = Math.max(10, bpmMultiplier) / 100;
    }

    if (timingChange) {
      const timingPoint = new TimingPoint();

      timingPoint.beatLength = beatLength;
      timingPoint.timeSignature = timeSignature;

      this.addControlPoint(timingPoint, startTime, true);
    }

    const difficultyPoint = new DifficultyPoint();

    difficultyPoint.bpmMultiplier = bpmMultiplier;
    difficultyPoint.speedMultiplier = speedMultiplier;

    this.addControlPoint(difficultyPoint, startTime, timingChange);

    const effectPoint = new EffectPoint();

    effectPoint.kiai = (effects & EffectType.Kiai) > 0;
    effectPoint.omitFirstBarLine = (effects & EffectType.OmitFirstBarLine) > 0;

    if (beatmap.originalMode !== 0) {
      effectPoint.scrollSpeed = speedMultiplier;
    }

    this.addControlPoint(effectPoint, startTime, timingChange);

    const samplePoint = new SamplePoint();

    samplePoint.sampleSet = sampleSet;
    samplePoint.customIndex = customIndex;
    samplePoint.volume = volume;

    this.addControlPoint(samplePoint, startTime, timingChange);
  }

  /**
   * Adds control point to the pending list 
   * and flushes all stored data on time change.
   * @param point A control point
   * @param time The time at which control point starts.
   * @param timingChange 
   */
  static addControlPoint(point: ControlPoint, time: number, timingChange: boolean): void {
    if (time !== this.pendingTime) {
      this.flushPendingPoints();
    }

    timingChange
      ? this.pendingPoints.unshift(point)
      : this.pendingPoints.push(point);

    this.pendingTime = time;
  }

  /**
   * Adds control points to their own group.
   */
  static flushPendingPoints(): void {
    const pendingTime = this.pendingTime;
    const pendingPoints = this.pendingPoints;
    const controlPoints = this.controlPoints;
    const pendingTypes = this.pendingTypes;

    let i = pendingPoints.length;

    while (--i >= 0) {
      /**
       * Changes from non-timing points are added to the end of the list
       * and should override any changes from timing points.
       */
      if (pendingTypes.includes(pendingPoints[i].pointType)) {
        continue;
      }

      pendingTypes.push(pendingPoints[i].pointType);
      controlPoints.add(pendingPoints[i], pendingTime);
    }

    this.pendingPoints = [];
    this.pendingTypes = [];
  }
}
