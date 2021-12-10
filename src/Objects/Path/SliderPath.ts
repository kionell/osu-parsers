import { Vector2, BinarySearch } from '../../Utils';

import { PathApproximator } from './PathApproximator';
import { PathPoint } from './PathPoint';
import { PathType } from '../Enums/PathType';

export class SliderPath {
  private _expectedDistance: number;

  private _controlPoints: PathPoint[];

  private _curveType: PathType;

  private _calculatedLength = 0;

  private _calculatedPath: Vector2[] = [];

  private _cumulativeLength: number[] = [];

  private _isCached = false;

  constructor(curveType?: PathType, controlPoints?: PathPoint[], expectedDistance?: number) {
    this._curveType = curveType || PathType.Linear;
    this._controlPoints = controlPoints || [];
    this._expectedDistance = expectedDistance || 0;
  }

  /**
   * Curve type.
   */
  get curveType(): PathType {
    return this._curveType;
  }

  set curveType(value: PathType) {
    this._curveType = value;
    this.invalidate();
  }

  /**
   * The control points of the path.
   */
  get controlPoints(): PathPoint[] {
    return this._controlPoints;
  }

  set controlPoints(value: PathPoint[]) {
    this._controlPoints = value;
    this.invalidate();
  }

  /**
   * The user-set distance of the path. 
   * If non-null, distance will match this value,
   * and the path will be shortened/lengthened to match this length.
   */
  get expectedDistance(): number {
    return this._expectedDistance;
  }

  set expectedDistance(value: number) {
    this._expectedDistance = value;
    this.invalidate();
  }

  /**
   * The distance of the path after lengthening/shortening 
   * to account for expected distance.
   */
  get distance(): number {
    this._ensureValid();

    if (this._cumulativeLength.length) {
      return this._cumulativeLength[this._cumulativeLength.length - 1];
    }

    return 0;
  }

  set distance(value: number) {
    this.expectedDistance = value;
  }

  /**
   * The distance of the path prior to lengthening/shortening 
   * to account for expected distance.
   */
  get calculatedDistance(): number {
    this._ensureValid();

    return this._calculatedLength;
  }

  /**
   * Invalidates path calculations.
   */
  invalidate(): void {
    this._calculatedLength = 0;

    this._calculatedPath = [];
    this._cumulativeLength = [];

    this._isCached = false;
  }

  /**
   * Computes the slider path until a given progress that ranges } from 0 (beginning of the slider)
   * to 1 (end of the slider) and stores the generated path in the given list.
   * @param path The list to be filled with the computed path.
   * @param p0 Start progress. Ranges } from 0 (beginning of the slider) to 1 (end of the slider).
   * @param p1 End progress. Ranges } from 0 (beginning of the slider) to 1 (end of the slider).
   */
  calculatePathToProgress(path: Vector2[], p0: number, p1: number): void {
    this._ensureValid();

    const d0 = this._progressToDistance(p0);
    const d1 = this._progressToDistance(p1);

    let i = 0;

    while (i < this._calculatedPath.length && this._cumulativeLength[i] < d0) {
      ++i;
    }

    path = [this._interpolateVertices(i, d0)];

    while (i < this._calculatedPath.length && this._cumulativeLength[i++] <= d1) {
      path.push(this._calculatedPath[i]);
    }

    path.push(this._interpolateVertices(i, d1));
  }

  /**
   * Computes the progress along the curve relative to how much of the hit object has been completed.
   * @param progress Where 0 is the start time of the hit object and 1 is the end time of the hit object.
   * @param spans Number of spans of the object.
   * @returns Progress of the object on the current span.
   */
  progressAt(progress: number, spans: number): number {
    const p = (progress * spans) % 1;

    return Math.trunc(progress * spans) % 2 ? 1 - p : p;
  }

  /**
   * Computes the position on the slider at a given progress
   * that ranges from 0 (beginning of the path) to 1 (end of the path).
   * @param progress Ranges from 0 (beginning of the path) to 1 (end of the path).
   */
  positionAt(progress: number): Vector2 {
    this._ensureValid();

    const d = this._progressToDistance(progress);

    return this._interpolateVertices(this._indexOfDistance(d), d);
  }

  /**
   * Computes the position on the curve relative to how much
   * of the hit object has been completed.
   * @param progress Where 0 is the start time of the hit object and 1 is the end time of the hit object.
   * @param spans Number of spans of the object.
   * @returns The position on the curve.
   */
  curvePositionAt(progress: number, spans: number): Vector2 {
    return this.positionAt(this.progressAt(progress, spans));
  }

  clone(): SliderPath {
    return new SliderPath(this._curveType, this._controlPoints, this._expectedDistance);
  }

  private _ensureValid(): void {
    if (this._isCached) {
      return;
    }

    this._calculatePath();
    this._calculateLength();

    this._isCached = true;
  }

  private _calculatePath(): void {
    this._calculatedPath = [] as Vector2[];

    const pathPointsLength = this.controlPoints.length;

    if (pathPointsLength === 0) {
      return;
    }

    const vertices = [] as Vector2[];

    for (let i = 0; i < pathPointsLength; i++) {
      vertices[i] = this.controlPoints[i].position;
    }

    let start = 0;

    for (let i = 0; i < pathPointsLength; ++i) {
      if (!this.controlPoints[i].type && i < pathPointsLength - 1) {
        continue;
      }

      // The current vertex ends the segment
      const segmentVertices = vertices.slice(start, i + 1);
      const segmentType = this.controlPoints[start].type || PathType.Linear;

      for (const t of this._calculateSubPath(segmentVertices, segmentType)) {
        const last = this._calculatedPath[this._calculatedPath.length - 1];

        if (this._calculatedPath.length === 0 || !last.equals(t)) {
          this._calculatedPath.push(t);
        }
      }

      // Start the new segment at the current vertex
      start = i;
    }
  }

  private _calculateSubPath(subControlPoints: Vector2[], type: PathType): Vector2[] {
    switch (type) {
      case PathType.Linear:
        return PathApproximator.approximateLinear(subControlPoints);

      case PathType.PerfectCurve: {
        if (subControlPoints.length !== 3) {
          break;
        }

        const subpath = PathApproximator.approximateCircularArc(subControlPoints);

        /**
         * If for some reason a circular arc could not be fit to the 3 given points,
         * fall back to a numerically stable bezier approximation.
         */
        if (subpath.length === 0) break;

        return subpath;
      }

      case PathType.Catmull:
        return PathApproximator.approximateCatmull(subControlPoints);
    }

    return PathApproximator.approximateBezier(subControlPoints);
  }

  private _calculateLength(): void {
    this._calculatedLength = 0;
    this._cumulativeLength = [0];

    for (let i = 0, l = this._calculatedPath.length - 1; i < l; ++i) {
      const diff = this._calculatedPath[i + 1].subtract(this._calculatedPath[i]);

      this._calculatedLength += diff.flength();
      this._cumulativeLength.push(this._calculatedLength);
    }

    if (this._calculatedLength !== this.expectedDistance) {
      /**
       * In osu-stable, if the last two control points 
       * of a slider are equal, extension is not performed.
       */
      const controlPoints = this.controlPoints;
      const lastPoint = controlPoints[controlPoints.length - 1];
      const preLastPoint = controlPoints[controlPoints.length - 2];
      const pointsAreEqual = controlPoints.length >= 2
        && lastPoint.position.equals(preLastPoint.position);

      if (pointsAreEqual && this.expectedDistance > this._calculatedLength) {
        this._cumulativeLength.push(this._calculatedLength);

        return;
      }

      /**
       * The last length is always incorrect
       */
      this._cumulativeLength.pop();

      let pathEndIndex = this._calculatedPath.length - 1;

      if (this._calculatedLength > this.expectedDistance) {
        /**
         * The path will be shortened further, in which case we should trim
         * any more unnecessary lengths and their associated path segments.
         */
        while (
          this._cumulativeLength.length > 0 &&
          this._cumulativeLength[this._cumulativeLength.length - 1] >=
            this.expectedDistance
        ) {
          this._cumulativeLength.pop();
          this._calculatedPath.splice(pathEndIndex--, 1);
        }
      }

      if (pathEndIndex <= 0) {
        /**
         * The expected distance is negative or zero
         * TODO: Perhaps negative path lengths should be disallowed altogether
         */
        this._cumulativeLength.push(0);

        return;
      }

      // The direction of the segment to shorten or lengthen
      const direction = this._calculatedPath[pathEndIndex]
        .subtract(this._calculatedPath[pathEndIndex - 1])
        .normalize();

      const distance = Math.fround(this.expectedDistance -
          this._cumulativeLength[this._cumulativeLength.length - 1]);

      this._calculatedPath[pathEndIndex] = this._calculatedPath[
        pathEndIndex - 1
      ].add(direction.scale(distance));

      this._cumulativeLength.push(this.expectedDistance);
    }
  }

  private _indexOfDistance(d: number): number {
    let i = BinarySearch.findNumber(this._cumulativeLength, d);

    if (i < 0) i = ~i;

    return i;
  }

  private _progressToDistance(progress: number): number {
    return Math.min(Math.max(progress, 0), 1) * this.distance;
  }

  private _interpolateVertices(i: number, d: number): Vector2 {
    if (this._calculatedPath.length === 0) {
      return new Vector2(0, 0);
    }

    if (i <= 0) {
      return this._calculatedPath[0];
    }

    if (i >= this._calculatedPath.length) {
      return this._calculatedPath[this._calculatedPath.length - 1];
    }

    const p0 = this._calculatedPath[i - 1];
    const p1 = this._calculatedPath[i];

    const d0 = this._cumulativeLength[i - 1];
    const d1 = this._cumulativeLength[i];

    /**
     * Avoid division by and almost-zero number 
     * in case two points are extremely close to each other.
     */
    if (Math.abs(d0 - d1) < 0.001) return p0;

    const w = (d - d0) / (d1 - d0);

    return p0.add(p1.subtract(p0).scale(Math.fround(w)));
  }
}
