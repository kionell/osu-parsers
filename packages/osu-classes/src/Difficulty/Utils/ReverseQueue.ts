/**
 * An indexed queue where items are indexed beginning from the most recently enqueued item.
 * Enqueuing an item pushes all existing indexes up by one and inserts the item at index 0.
 * Dequeuing an item removes the item from the highest index and returns it.
 */
export class ReverseQueue<T> {
  /**
   * The number of elements in the queue.
   */
  count = 0;

  private _items: T[];
  private _capacity: number;
  private _start: number;

  constructor(initialCapacity: number) {
    if (initialCapacity <= 0) {
      throw new Error('Capacity of the reverse queue must be greater than 0!');
    }

    this._items = [];
    this._capacity = initialCapacity;
    this._start = 0;
  }

  /**
   * Retrieves the item at an index in the queue.
   * @param index The index of the item to retrieve.
   * The most recently enqueued item is at index 0.
   */
  get(index: number): T {
    if (index < 0 || index > this.count - 1) {
      throw new Error('Index is out of range!');
    }

    const reverseIndex = this.count - 1 - index;

    return this._items[(this._start + reverseIndex) % this._capacity];
  }

  /**
   * Enqueues an item to this queue.
   * @param item The item to enqueue.
   */
  enqueue(item: T): void {
    if (this.count === this._capacity) {
      this._capacity *= 2;
      this._start = 0;
    }

    this._items[(this._start + this.count) % this._capacity] = item;
    this.count++;
  }

  /**
   * Dequeues the least recently enqueued item from the queue and returns it.
   * @returns The item dequeued from the queue.
   */
  dequeue(): T {
    const item = this._items[this._start];

    this._start = (this._start + 1) % this._capacity;
    this.count--;

    return item;
  }

  /**
   * Clears the queue of all items.
   */
  clear(): void {
    this._start = 0;
    this.count = 0;
  }

  /**
   * Enumerates the queue starting from the most recently enqueued item.
   * @returns An enumerator which enumerates items in the queue.
   */
  *enumerate(): Generator<T> {
    if (this.count === 0) return;

    for (let i = this.count; i >= this._start; --i) {
      yield this._items[i];
    }
  }
}
