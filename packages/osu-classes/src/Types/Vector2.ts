export class Vector2 {
  /**
   * The X-position.
   */
  x: number;

  /**
   * The Y-position.
   */
  y: number;

  /**
   * Creates a new instance of a Vector2.
   * @param x The X-position.
   * @param y The Y-position.
   */
  constructor(x: number, y?: number) {
    this.x = x;
    this.y = isFinite(y as number) ? (y as number) : x;
  }

  get floatX(): number {
    return Math.fround(this.x);
  }

  get floatY(): number {
    return Math.fround(this.y);
  }

  /**
   * Adds a vector to the current and returns a new instance.
   * @param vec Vector to add.
   */
  add(vec: Vector2): Vector2 {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }

  /**
   * Adds a vector to the current and 
   * returns a new instance with single precision.
   * @param vec Vector to add.
   */
  fadd(vec: Vector2): Vector2 {
    return new Vector2(
      Math.fround(this.floatX + vec.floatX),
      Math.fround(this.floatY + vec.floatY),
    );
  }

  /**
   * Subtracts a vector from the current and returns a new instance.
   * @param vec Vector to substract.
   */
  subtract(vec: Vector2): Vector2 {
    return new Vector2(this.x - vec.x, this.y - vec.y);
  }

  /**
   * Subtracts a vector from the current and 
   * returns a new instance with single precision.
   * @param vec Vector to substract.
   */
  fsubtract(vec: Vector2): Vector2 {
    return new Vector2(
      Math.fround(this.floatX - vec.floatX),
      Math.fround(this.floatY - vec.floatY),
    );
  }

  /**
   * Scales the current vector and returns a new instance.
   * @param multiplier Vector multiplier.
   */
  scale(multiplier: number): Vector2 {
    return new Vector2(this.x * multiplier, this.y * multiplier);
  }

  /**
   * Scales the current vector and 
   * returns a new instance with single precision.
   * @param vec Vector to substract.
   */
  fscale(multiplier: number): Vector2 {
    const floatMultiplier = Math.fround(multiplier);

    return new Vector2(
      Math.fround(this.floatX * floatMultiplier),
      Math.fround(this.floatY * floatMultiplier),
    );
  }

  /**
   * Divides the current vector and returns a new instance.
   * @param divisor Vector divisor.
   */
  divide(divisor: number): Vector2 {
    return new Vector2(this.x / divisor, this.y / divisor);
  }

  /**
   * Subtracts a vector from the current and 
   * returns a new instance with single precision.
   * @param vec Vector to substract.
   */
  fdivide(divisor: number): Vector2 {
    const floatDivisor = Math.fround(divisor);

    return new Vector2(
      Math.fround(this.floatX / floatDivisor),
      Math.fround(this.floatY / floatDivisor),
    );
  }

  /**
   * Returns a dot product of two vectors.
   * @param vec Second vector.
   */
  dot(vec: Vector2): number {
    return this.x * vec.x + this.y * vec.y;
  }

  /**
   * Returns a dot product of two vectors with single precision.
   * @param vec Second vector.
   */
  fdot(vec: Vector2): number {
    return Math.fround(
      Math.fround(
        Math.fround(this.floatX * vec.floatX) +
        Math.fround(this.floatY * vec.floatY),
      ),
    );
  }

  /**
   * Returns a length of two points in a vector.
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns a single precision length of two points in a vector.
   */
  flength(): number {
    return Math.fround(
      Math.sqrt(
        Math.fround(
          Math.fround(this.floatX * this.floatX) +
          Math.fround(this.floatY * this.floatY),
        ),
      ),
    );
  }

  /**
   * Returns a distance between two vectors.
   * @param vec Second vector.
   */
  distance(vec: Vector2): number {
    const x = this.x - vec.x;
    const y = this.y - vec.y;

    return Math.sqrt(x * x + y * y);
  }

  fdistance(vec: Vector2): number {
    const x = Math.fround(this.floatX - vec.floatX);
    const y = Math.fround(this.floatY - vec.floatY);

    return Math.fround(
      Math.sqrt(
        Math.fround(Math.fround(x * x) + Math.fround(y * y)),
      ),
    );
  }

  /**
   * Returns a normalized vector.
   */
  normalize(): Vector2 {
    const scale = 1 / this.length();

    return new Vector2(this.x * scale, this.y * scale);
  }

  /**
   * Returns a normalized vector with single precision.
   */
  fnormalize(): Vector2 {
    const scale = Math.fround(1 / this.flength());

    return new Vector2(
      Math.fround(this.floatX * scale),
      Math.fround(this.floatY * scale),
    );
  }

  /**
   * Returns if two vectors are equal.
   * @param vec Second vector.
   */
  equals(vec: Vector2): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  /**
   * Clones the current vector.
   * @returns A cloned vector.
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * @returns A string representation of this vector.
   */
  toString(): string {
    return `${this.x},${this.y}`;
  }
}
