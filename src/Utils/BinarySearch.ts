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
    let start = 0,
      mid,
      end = arr.length - 1;

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      mid = Math.floor((start + end) / 2);

      if (arr[mid] > x) {
        end = mid - 1;
      }
      else if (arr[mid] <= x) {
        start = mid + 1;
      }
    }

    return Math.floor((start + end) / 2);
  }

  /**
   * Searches a control point at the specified time.
   * @param arr The list of control points.
   * @param time The time to search for.
   * @returns Found control point.
   */
  static findControlPoint(arr: ControlPoint[], time: number): ControlPoint | null {
    if (!arr.length) {
      return null;
    }

    if (time < arr[0].startTime) {
      return null;
    }

    if (time >= arr[arr.length - 1].startTime) {
      return arr[arr.length - 1];
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
        return arr[pivot];
      }
    }

    // L will be the first control point with startTime > time, but we want the one before it
    return arr[l - 1];
  }
}
