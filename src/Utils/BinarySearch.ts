import { ControlPoint } from '../Beatmaps/ControlPoints/ControlPoint';

/**
 * A binary search utility.
 */
export class BinarySearch {
  /**
   * Searches an entire one-dimensional sorted array for a specific value.
   * @param arr The sorted one-dimensional array to search.
   * @param x The value to search for.
   * @returns Found value.
   */
  static findNumber(arr: number[], x: number): number {
    let start = 0, mid, end = arr.length - 1;

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      mid = start + ((end - start) >> 1);

      if (arr[mid] === x) {
        return mid;
      }

      if (arr[mid] < x) {
        start = mid + 1;
      }
      else {
        end = mid - 1;
      }
    }

    return ~start;
  }

  /**
   * Searches a control point at the specified time.
   * @param arr The list of control points.
   * @param time The time to search for.
   * @returns Found control point.
   */
  static findControlPointIndex(arr: ControlPoint[], time: number): number {
    if (!arr.length) {
      return -1;
    }

    if (time < arr[0].startTime) {
      return -1;
    }

    if (time >= arr[arr.length - 1].startTime) {
      return arr.length - 1;
    }

    let l = 0;
    let r = arr.length - 2;

    while (l <= r) {
      const pivot = l + ((r - l) >> 1);

      if (arr[pivot].startTime < time) {
        l = pivot + 1;
      }
      else if (arr[pivot].startTime > time) {
        r = pivot - 1;
      }
      else {
        return pivot;
      }
    }

    // L will be the first control point with startTime > time, but we want the one before it
    return l - 1;
  }

  /**
   * Searches a control point at the specified time.
   * @param arr The list of control points.
   * @param time The time to search for.
   * @returns Found control point.
   */
  static findControlPoint(arr: ControlPoint[], time: number): ControlPoint | null {
    const index = this.findControlPointIndex(arr, time);

    if (index === -1) return null;

    return arr[index];
  }
}
