export class SortHelper {
  private static _QUICK_SORT_DEPTH_THRESHOLD = 32;
  private static _INTRO_SORT_SIZE_THRESHOLD = 16;

  /**
   * Sorts an array with mutation via depth limited quick sort algorithm.
   * @param keys The array to be sorted.
   * @param comparerFn The sorting function.
   * @returns The same array.
   */
  static depthSort(keys: any[], comparerFn?: ((a: any, b: any) => number)): any[] {
    if (!keys || keys.length === 0) {
      return keys;
    }

    comparerFn ??= this.defaultCompare;

    this._depthLimitedQuickSort(keys, 0, keys.length - 1, comparerFn, this._QUICK_SORT_DEPTH_THRESHOLD);

    return keys;
  }

  /**
   * Sorts an array with mutation via introspective sort algorithm.
   * @param keys The array to be sorted.
   * @param comparerFn The sorting function.
   * @returns The same array.
   */
  static introSort(keys: any[], comparerFn?: ((a: any, b: any) => number)): any[] {
    if (!keys || keys.length < 2) {
      return keys;
    }

    comparerFn ??= this.defaultCompare;

    this._introSort(keys, 0, keys.length - 1, comparerFn, 2 * this._floorLog2(keys.length));

    return keys;
  }

  private static _depthLimitedQuickSort(
    keys: any[],
    left: number,
    right: number,
    comparerFn: ((a: any, b: any) => number),
    depthLimit: number,
  ): void {
    do {
      if (depthLimit === 0) {
        return this._heapsort(keys, left, right, comparerFn);
      }

      let i = left;
      let j = right;

      /**
       * pre-sort the low, middle (pivot), and high values in place.
       * this improves performance in the face of already sorted data, or
       * data that is made up of multiple sorted runs appended together.
       */
      const middle = i + ((j - i) >> 1);

      this._swapIfGreater(keys, comparerFn, i, middle); // swap the low with the mid point.
      this._swapIfGreater(keys, comparerFn, i, j); // swap the low with the high.
      this._swapIfGreater(keys, comparerFn, middle, j); // swap the middle with the high.

      const x = keys[middle];

      do {
        while (comparerFn(keys[i], x) < 0) i++;
        while (comparerFn(x, keys[j]) < 0) j--;

        if (i > j) break;

        if (i < j) {
          [keys[i], keys[j]] = [keys[j], keys[i]];
        }

        i++;
        j--;
      } while (i <= j);

      /**
       * The next iteration of the while loop is to "recursively" sort the larger half of the array and the
       * following calls recrusively sort the smaller half. So we subtrack one from depthLimit here so
       * both sorts see the new value.
       */
      depthLimit--;

      if (j - left <= right - i) {
        if (left < j) {
          this._depthLimitedQuickSort(keys, left, j, comparerFn, depthLimit);
        }

        left = i;
        continue;
      }

      if (i < right) {
        this._depthLimitedQuickSort(keys, i, right, comparerFn, depthLimit);
      }

      right = j;
    } while (left < right);
  }

  private static _introSort(
    keys: any[],
    left: number,
    right: number,
    comparerFn: ((a: any, b: any) => number),
    depthLimit: number,
  ): void {
    while (right > left) {
      const partitionSize = right - left + 1;

      if (partitionSize <= this._INTRO_SORT_SIZE_THRESHOLD) {
        if (partitionSize === 1) return;

        if (partitionSize === 2) {
          this._swapIfGreater(keys, comparerFn, left, right);

          return;
        }

        if (partitionSize === 3) {
          this._swapIfGreater(keys, comparerFn, left, right - 1);
          this._swapIfGreater(keys, comparerFn, left, right);
          this._swapIfGreater(keys, comparerFn, right - 1, right);

          return;
        }

        this._insertionSort(keys, left, right, comparerFn);

        return;
      }

      if (depthLimit === 0) {
        this._heapsort(keys, left, right, comparerFn);

        return;
      }

      depthLimit--;

      const p = this._pickPivotAndPartition(keys, left, right, comparerFn);

      /**
       * Note we've already partitioned around the pivot 
       * and do not have to move the pivot again.
       */
      this._introSort(keys, p + 1, right, comparerFn, depthLimit);

      right = p - 1;
    }
  }

  private static _insertionSort(
    keys: any[],
    lo: number,
    hi: number,
    comparerFn: ((a: any, b: any) => number),
  ): void {
    for (let i = lo; i < hi; ++i) {
      let j = i;
      const t = keys[i + 1];

      while (j >= lo && comparerFn(t, keys[j]) < 0) {
        keys[j + 1] = keys[j];
        j--;
      }

      keys[j + 1] = t;
    }
  }

  private static _pickPivotAndPartition(
    keys: any[],
    lo: number,
    hi: number,
    comparerFn: ((a: any, b: any) => number),
  ): number {
    /**
     * Compute median-of-three.
     * But also partition them, since we've done the comparison.
     */
    const middle = (lo + ((hi - lo) / 2)) >> 0;

    /**
     * Sort lo, mid and hi appropriately, then pick mid as the pivot.
     */
    this._swapIfGreater(keys, comparerFn, lo, middle); // swap the low with the mid point
    this._swapIfGreater(keys, comparerFn, lo, hi); // swap the low with the high
    this._swapIfGreater(keys, comparerFn, middle, hi); // swap the middle with the high

    const pivot = keys[middle];

    this._swap(keys, middle, hi - 1);

    /**
     * We already partitioned lo and hi and put the pivot in hi - 1.
     * And we pre-increment & decrement below.
     */
    let left = lo;
    let right = hi - 1;

    while (left < right) {
      while (comparerFn(keys[++left], pivot) < 0);
      while (comparerFn(pivot, keys[--right]) < 0);

      if (left >= right) break;

      this._swap(keys, left, right);
    }

    /**
     * Put pivot in the right location.
     */
    this._swap(keys, left, (hi - 1));

    return left;
  }

  private static _heapsort(
    keys: any[],
    lo: number,
    hi: number,
    comparerFn: ((a: any, b: any) => number),
  ): void {
    const n = hi - lo + 1;

    for (let i = n / 2; i >= 1; --i) {
      this._downHeap(keys, i, n, lo, comparerFn);
    }

    for (let i = n; i > 1; --i) {
      this._swap(keys, lo, lo + i - 1);
      this._downHeap(keys, 1, i - 1, lo, comparerFn);
    }
  }

  private static _downHeap(
    keys: any[],
    i: number,
    n: number,
    lo: number,
    comparerFn: ((a: any, b: any) => number),
  ): void {
    const d = keys[lo + i - 1];

    while (i <= n / 2) {
      let child = 2 * i;

      if (child < n && comparerFn(keys[lo + child - 1], keys[lo + child]) < 0) {
        child++;
      }

      if (comparerFn(d, keys[lo + child - 1]) >= 0) break;

      keys[lo + i - 1] = keys[lo + child - 1];
      i = child;
    }

    keys[lo + i - 1] = d;
  }

  private static _swap(keys: any[], i: number, j: number): void {
    if (i !== j) {
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
  }

  private static _swapIfGreater(
    keys: any[],
    comparerFn: ((a: any, b: any) => number),
    a: number,
    b: number,
  ): void {
    if (a !== b && comparerFn(keys[a], keys[b]) > 0) {
      [keys[a], keys[b]] = [keys[b], keys[a]];
    }
  }

  private static _floorLog2(n: number): number {
    let result = 0;

    while (n >= 1) {
      result++;
      n /= 2;
    }

    return result;
  }

  static defaultCompare = (x: unknown, y: unknown): number => {
    if (x === undefined && y === undefined) {
      return 0;
    }

    if (x === undefined) {
      return 1;
    }

    if (y === undefined) {
      return -1;
    }

    const xString = SortHelper.toString(x);
    const yString = SortHelper.toString(y);

    if (xString < yString) {
      return -1;
    }

    if (xString > yString) {
      return 1;
    }

    return 0;
  };

  static toString = (obj: unknown): string => {
    if (obj === null) {
      return 'null';
    }

    if (typeof obj === 'boolean' || typeof obj === 'number') {
      return (obj).toString();
    }

    if (typeof obj === 'string') {
      return obj;
    }

    if (typeof obj === 'symbol') {
      throw new TypeError();
    }

    return JSON.stringify(obj);
  };
}
