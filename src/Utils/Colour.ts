import { Color4 } from './Color4';

/**
 * A legacy color class. 
 * Use the {@link Color4} class instead.
 * @deprecated Since 0.10.0.
 */
export class Colour extends Color4 {
  /**
   * Creates a new color.
   * @param red Red value of the color.
   * @param green Green value of the color.
   * @param blue Blue value of the color.
   */
  constructor(red?: number, green?: number, blue?: number) {
    super(red, green, blue, 255);
  }

  /**
   * The HEX representation of the color.
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
   * @param color Another color.
   * @returns Wheter the color equals to another one.
   */
  equals(color: Colour): boolean {
    return this.red === color.red
      && this.green === color.green
      && this.blue === color.blue;
  }

  /**
   * Clones the current color.
   * @returns A cloned color.
   */
  clone(): Colour {
    return new Colour(this.red, this.green, this.blue);
  }

  /**
   * @returns A string representation of this color.
   */
  toString(): string {
    return `${this.red},${this.green},${this.blue}`;
  }
}
