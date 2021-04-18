export class FastRandom {
  static MAX_INT32 = 2147483647;

  static MAX_UINT32 = 4294967295;

  static INT_MASK: number = 0x7fffffff >> 0;

  static INT_TO_REAL: number = 1 / (FastRandom.MAX_INT32 + 1);

  private _y: number = 842502087 >>> 0; // Uint32

  private _z: number = 3579807591 >>> 0; // Uint32

  private _w: number = 273326509 >>> 0; // Uint32

  private _x = 0;

  private _bitBuffer = 0; // Uint32

  private _bitIndex = 32; // Int32

  /**
   * Creates a new instance of the Fast PRNG.
   * @param seed RNG seed.
   */
  constructor(seed: number) {
    this._x = seed;
  }

  private _next() {
    // Uint32
    const t = (this._x ^ ((this._x << 11) >>> 0)) >>> 0;

    this._x = this._y >>> 0;
    this._y = this._z >>> 0;
    this._z = this._w >>> 0;

    // Uint32
    this._w = (this._w ^ (this._w >>> 19)) >>> 0;
    this._w = (this._w ^ t) >>> 0;
    this._w = (this._w ^ (t >>> 8)) >>> 0;

    return this._w;
  }

  /**
   * Generates a random unsigned integer within the range [0, MAX_UINT32).
   * @returns The random value.
   */
  next(): number {
    // Int32
    return (FastRandom.INT_MASK & this._next()) >> 0;
  }

  /**
   * Generates a random unsigned integer value
   * within the range [lowerBound, upperBound).
   * @param lowerBound The lower bound of the range.
   * @param upperBound The upper bound of the range.
   * @returns The random integer value.
   */
  nextUInt(lowerBound = 0, upperBound = FastRandom.MAX_INT32): number {
    return (lowerBound + this.nextDouble() * (upperBound - lowerBound)) >>> 0;
  }

  /**
   * Generates a random integer value
   * within the range [lowerBound, upperBound).
   * @param lowerBound The lower bound of the range.
   * @param upperBound The upper bound of the range.
   * @returns The random integer value.
   */
  nextInt(lowerBound = 0, upperBound = FastRandom.MAX_INT32): number {
    return (lowerBound + this.nextDouble() * (upperBound - lowerBound)) >> 0;
  }

  /**
   * Generates a random double value within the range [0, 1).
   * @returns The random value.
   */
  nextDouble(): number {
    return FastRandom.INT_TO_REAL * this.next();
  }

  /**
   * Generates a random boolean value.
   * Cached such that a random value is only generated once in every 32 calls.
   * @returns The random value.
   */
  nextBool(): boolean {
    if (this._bitIndex === 32) {
      this._bitBuffer = this.nextUInt();
      this._bitIndex = 1;

      return (this._bitBuffer & 1) === 1;
    }

    this._bitIndex = (this._bitIndex + 1) >> 0;

    return ((this._bitBuffer >>= 1) & 1) === 1;
  }
}
