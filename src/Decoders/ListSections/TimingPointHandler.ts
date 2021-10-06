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
} from 'osu-resources';

import { ParsedBeatmap } from '../../Classes/ParsedBeatmap';

/**
 * A decoder for beatmap control points.
 */
export abstract class TimingPointHandler {
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
   */
  static handleLine(line: string, beatmap: ParsedBeatmap): void {
    // Time,beatLength,meter,sampleSet,sampleIndex,volume,uninherited,effects

    TimingPointHandler.controlPoints = beatmap.controlPoints;

    const data = line.split(',').map((v) => +v.trim());

    let timeSignature = TimeSignature.SimpleQuadruple;
    let sampleSet = SampleSet[SampleSet.None];
    let customIndex = 0;
    let volume = 100;
    let uninherited = false;
    let effects = EffectType.None;

    switch (data.length) {
      case 8:
        effects = data[7];
      case 7:
        uninherited = !!data[6];
      case 6:
        volume = data[5];
      case 5:
        customIndex = data[4];
      case 4:
        sampleSet = SampleSet[data[3]];
      case 3:
        timeSignature = data[2];
    }

    const beatLength = data[1];
    const startTime = data[0];

    let bpmMultiplier = 1;
    let speedMultiplier = 1;

    if (beatLength < 0) {
      speedMultiplier = 100 / -beatLength;
      bpmMultiplier = Math.min(Math.fround(-beatLength), 10000);
      bpmMultiplier = Math.max(10, bpmMultiplier) / 100;
    }

    if (uninherited) {
      const timingPoint = new TimingPoint();

      timingPoint.beatLength = beatLength;
      timingPoint.timeSignature = timeSignature;

      TimingPointHandler.addControlPoint(timingPoint, startTime);
    }

    const difficultyPoint = new DifficultyPoint();

    difficultyPoint.bpmMultiplier = bpmMultiplier;
    difficultyPoint.speedMultiplier = speedMultiplier;

    TimingPointHandler.addControlPoint(difficultyPoint, startTime);

    const effectPoint = new EffectPoint();

    effectPoint.kiai = (effects & EffectType.Kiai) > 0;
    effectPoint.omitFirstBarLine = (effects & EffectType.OmitFirstBarLine) > 0;

    TimingPointHandler.addControlPoint(effectPoint, startTime);

    const samplePoint = new SamplePoint();

    samplePoint.sampleSet = sampleSet;
    samplePoint.customIndex = customIndex;
    samplePoint.volume = volume;

    TimingPointHandler.addControlPoint(samplePoint, startTime);
  }

  /**
   * Adds control point to the pending list 
   * and flushes all stored data on time change.
   * @param point A control point
   * @param time The time at which control point starts.
   */
  static addControlPoint(point: ControlPoint, time: number): void {
    if (time !== TimingPointHandler.pendingTime) {
      TimingPointHandler.flushPendingPoints();
    }

    TimingPointHandler.pendingPoints.push(point);

    TimingPointHandler.pendingTime = time;
  }

  /**
   * Adds control points to their own group.
   */
  static flushPendingPoints(): void {
    const pendingTime = TimingPointHandler.pendingTime;
    const pendingPoints = TimingPointHandler.pendingPoints;
    const controlPoints = TimingPointHandler.controlPoints;
    const pendingTypes = TimingPointHandler.pendingTypes;

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

    TimingPointHandler.pendingPoints = [];
    TimingPointHandler.pendingTypes = [];
  }
}
