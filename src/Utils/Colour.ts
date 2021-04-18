/**
 * A colour.
 */
export class Colour {
  /**
   * The red value of the colour.
   */
  red: number;

  /**
   * The green value of the colour.
   */
  green: number;

  /**
   * The blue value of the colour.
   */
  blue: number;

  /**
   * Creates a new colour.
   * @param red Red value of the colour.
   * @param green Green value of the colour.
   * @param blue Blue value of the colour.
   */
  constructor(red?: number, green?: number, blue?: number) {
    this.red = red || 0;
    this.green = green || 0;
    this.blue = blue || 0;
  }

  /**
   * The HEX representation of the colour.
   */
  get hex(): string {
    return (
      '#' +
      this.red.toString(16).padStart(2, '0') +
      this.green.toString(16).padStart(2, '0') +
      this.blue.toString(16).padStart(2, '0')
    );
  }

  /**
   * @param colour Another colour.
   * @returns Wheter the colour equals to another one.
   */
  equals(colour: Colour): boolean {
    return this.red === colour.red
      && this.green === colour.green
      && this.blue === colour.blue;
  }

  /**
   * Clones the current colour.
   * @returns A cloned colour.
   */
  clone(): Colour {
    return new Colour(this.red, this.green, this.blue);
  }

  /**
   * @returns A string representation of this colour.
   */
  toString(): string {
    return `${this.red},${this.green},${this.blue}`;
  }
}
