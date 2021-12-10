/**
 * An indexed queue with limited capacity.
 * Respects first-in-first-out insertion order.
 */
export class LimitedCapacityQueue<T> {
  /**
   * The number of elements in the queue.
   */
  count = 0;

  private readonly _array: T[];
  private readonly _capacity: number;

  /**
   * Markers tracking the queue's first and last element.
   */
  private _start = 0;
  private _end = -1;

  /**
   * Constructs a new LimitedCapacityQueue.
   * @param capacity The number of items the queue can hold.
   */
  constructor(capacity: number) {
    if (capacity < 0) {
      throw new Error('Capacity of the limited queue must be greater than 0!');
    }

    this._capacity = capacity;
    this._array = [];
    this.clear();
  }

  /**
   * Whether the queue is full (adding any new items will cause removing existing ones).
   */
  get full(): boolean {
    return this.count === this._capacity;
  }

  /**
   * Removes all elements from the queue.
   */
  clear(): void {
    this._start = 0;
    this._end = -1;
    this.count = 0;
  }

  /**
   * Removes an item from the front of the queue.
   * @returns The item removed from the front of the queue.
   */
  dequeue(): T {
    if (this.count === 0) {
      throw new Error('Queue is empty!');
    }

    const result = this._array[this._start];

    this._start = (this._start + 1) % this._capacity;
    this.count--;

    return result;
  }

  /**
   * Adds an item to the back of the queue.
   * If the queue is holding maximum elements at the point of addition,
   * the item at the front of the queue will be removed.
   * @param item The item to be added to the back of the queue.
   */
  enqueue(item: T): void {
    this._end = (this._end + 1) % this._capacity;

    if (this.count === this._capacity) {
      this._start = (this._start + 1) % this._capacity;
    }
    else {
      this.count++;
    }

    this._array[this._end] = item;
  }

  /**
   * Retrieves the item at the given index in the queue.
   * @param index  The index of the item to retrieve.
   * The item with index 0 is at the front of the queue (it was added the earliest).
   */
  get(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new Error('Index is out of range!');
    }

    return this._array[(this._start + index) % this._capacity];
  }

  /**
   * Enumerates the queue from its start to its end.
   * @returns An enumerator which enumerates items in the queue.
   */
  *enumerate(): Generator<T> {
    if (this.count === 0) return;

    for (let i = 0; i < this.count; ++i) {
      yield this._array[(this._start + i) % this._capacity];
    }
  }
}
