import { BinarySearch } from '../../Utils';

import { ControlPointType } from '../Enums/ControlPointType';
import { ControlPointGroup } from './ControlPointGroup';
import { ControlPoint } from './ControlPoint';

import { DifficultyPoint } from './DifficultyPoint';
import { EffectPoint } from './EffectPoint';
import { SamplePoint } from './SamplePoint';
import { TimingPoint } from './TimingPoint';

/**
 * The information about control points.
 */
export class ControlPointInfo {
  /**
   * All groups of control points.
   */
  groups: ControlPointGroup[] = [];

  /**
   * All difficulty points.
   */
  difficultyPoints: DifficultyPoint[] = [];

  /**
   * All effect points.
   */
  effectPoints: EffectPoint[] = [];

  /**
   * All sample points.
   */
  samplePoints: SamplePoint[] = [];

  /**
   * All timing points.
   */
  timingPoints: TimingPoint[] = [];

  /**
   * All control points.
   */
  get allPoints(): ControlPoint[] {
    const points: ControlPoint[] = [];

    this.groups.forEach((g) => points.push(...g.controlPoints));

    return points;
  }

  /**
   * Finds a group at the specified time.
   * @param time The time.
   * @returns A group at the specified time.
   */
  groupAt(time: number): ControlPointGroup {
    let group = this.groups.find((g) => g.startTime === time);

    if (!group) {
      group = new ControlPointGroup(time);

      this.groups.push(group);
      this.groups.sort((a, b) => a.startTime - b.startTime);
    }

    return group;
  }

  /**
   * Finds a difficulty point at the specified time.
   * @param time The time.
   * @returns A difficulty point at the specified time.
   */
  difficultyPointAt(time: number): DifficultyPoint {
    const point = BinarySearch.findControlPoint(this.difficultyPoints, time);
    const fallback = DifficultyPoint.default;

    return (point as DifficultyPoint) || fallback;
  }

  /**
   * Finds a effect point at the specified time.
   * @param time The time.
   * @returns A effect point at the specified time.
   */
  effectPointAt(time: number): EffectPoint {
    const point = BinarySearch.findControlPoint(this.effectPoints, time);
    const fallback = EffectPoint.default;

    return (point as EffectPoint) || fallback;
  }

  /**
   * Finds a sample point at the specified time.
   * @param time The time.
   * @returns A sample point at the specified time.
   */
  samplePointAt(time: number): SamplePoint {
    const point = BinarySearch.findControlPoint(this.samplePoints, time);
    const fallback = SamplePoint.default;

    return (point as SamplePoint) || fallback;
  }

  /**
   * Finds a timing point at the specified time.
   * @param time The time.
   * @returns A timing point at the specified time.
   */
  timingPointAt(time: number): TimingPoint {
    const point = BinarySearch.findControlPoint(this.timingPoints, time);
    const fallback = this.timingPoints[0] || TimingPoint.default;

    return (point as TimingPoint) || fallback;
  }

  /**
   * Adds a new unique control point to the group at the specified time.
   * @param point A control point.
   * @param time The time.
   * @returns Whether the control point has been added to the group.
   */
  add(point: ControlPoint, time: number): boolean {
    if (this.checkAlreadyExisting(time, point)) {
      return false;
    }

    const list = this.getCurrentList(point);
    const index = BinarySearch.findControlPointIndex(list, time);

    /**
     * We need to imitate C# sorted list here.
     * Since we already have binary search function for control points,
     * we can just insert new elements via splice by found index.
     */
    list.splice(index + 1, 0, point);

    this.groupAt(time).add(point);

    return true;
  }

  getCurrentList(newPoint: ControlPoint): ControlPoint[] {
    switch (newPoint.pointType) {
      case ControlPointType.DifficultyPoint: return this.difficultyPoints;
      case ControlPointType.EffectPoint: return this.effectPoints;
      case ControlPointType.SamplePoint: return this.samplePoints;
      case ControlPointType.TimingPoint: return this.timingPoints;
    }

    throw new TypeError(`Unknown control point type: ${newPoint.pointType}!`);
  }

  checkAlreadyExisting(time: number, newPoint: ControlPoint): boolean {
    let existing = null;

    switch (newPoint.pointType) {
      case ControlPointType.DifficultyPoint:
        existing = this.difficultyPointAt(time);
        break;

      case ControlPointType.EffectPoint:
        existing = this.effectPointAt(time);
        break;

      case ControlPointType.SamplePoint:
        existing = BinarySearch.findControlPoint(this.samplePoints, time);
        break;

      case ControlPointType.TimingPoint:
        existing = BinarySearch.findControlPoint(this.timingPoints, time);
    }

    return newPoint?.isRedundant(existing);
  }

  /**
   * Removes a control point from the group at the specified time.
   * @param point A control point.
   * @param time The time.
   * @returns Whether the control point has been removed from the group.
   */
  remove(point: ControlPoint, time: number): boolean {
    let list: ControlPoint[];

    switch (point.pointType) {
      case ControlPointType.DifficultyPoint:
        list = this.difficultyPoints;
        break;

      case ControlPointType.EffectPoint:
        list = this.effectPoints;
        break;

      case ControlPointType.SamplePoint:
        list = this.samplePoints;
        break;

      default:
        list = this.timingPoints;
    }

    const index = list.findIndex((p) => {
      return p.startTime === point.startTime;
    });

    if (index === -1) {
      return false;
    }

    list.splice(index, 1);

    this.groupAt(time).remove(point);

    return true;
  }

  /**
   * Removes all control points.
   */
  clear(): void {
    this.groups.length = 0;
    this.difficultyPoints.length = 0;
    this.effectPoints.length = 0;
    this.samplePoints.length = 0;
    this.timingPoints.length = 0;
  }

  /**
   * Creates a copy of this information about control points.
   * Non-primitive properties will be copied via their own clone() method.
   * @returns A copied information about control points.
   */
  clone(): ControlPointInfo {
    const cloned = new ControlPointInfo();

    cloned.groups = this.groups;

    cloned.difficultyPoints = this.difficultyPoints;
    cloned.effectPoints = this.effectPoints;
    cloned.samplePoints = this.samplePoints;
    cloned.timingPoints = this.timingPoints;

    return cloned;
  }
}
