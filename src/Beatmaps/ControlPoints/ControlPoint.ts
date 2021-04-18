import { ControlPointGroup } from './ControlPointGroup';
import { ControlPointType } from '../Enums/ControlPointType';

/**
 * A control point of a beatmap.
 */
export abstract class ControlPoint {
  abstract pointType: ControlPointType;

  /**
   * The group to which a control point belongs.
   */
  group: ControlPointGroup | null;

  /**
   * Creates a new instance of a control point.
   * @param group A group of this control point.
   * @constructor
   */
  constructor(group?: ControlPointGroup) {
    this.group = group || null;
  }

  /**
   * Attaches a new group to this control point.
   * @param group A new group.
   */
  attachGroup(group: ControlPointGroup): void {
    this.group = group;
  }

  /**
   * Dettaches a group from this control point.
   */
  dettachGroup(): void {
    this.group = null;
  }

  /**
   * The time at which control point starts.
   */
  get startTime(): number {
    if (this.group) {
      return (this.group as ControlPointGroup).startTime;
    }

    return 0;
  }

  abstract isRedundant(existing: ControlPoint | null): boolean;
}
