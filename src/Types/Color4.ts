/**
 * A color that supports RGBA format.
 */
export class Color4 {
  /**
   * The red value of the color in range from 0 to 255.
   * @default 255
   */
  red: number;

  /**
   * The green value of the color in range from 0 to 255.
   * @default 255
   */
  green: number;

  /**
   * The blue value of the color in range from 0 to 255.
   * @default 255
   */
  blue: number;

  /**
   * The alpha value of the color in range from 0 to 1.
   * @default 1
   */
  alpha: number;

  /**
   * Creates a new color.
   * @param red Red value of the color in range from 0 to 255.
   * @param green Green value of the color in range from 0 to 255.
   * @param blue Blue value of the color in range from 0 to 255.
   * @param alpha Alpha value of the color in range from 0 to 1.
   */
  constructor(red?: number, green?: number, blue?: number, alpha?: number) {
    this.red = red ?? 255;
    this.green = green ?? 255;
    this.blue = blue ?? 255;
    this.alpha = alpha ?? 1;
  }

  /**
   * The HEX representation of the color.
   */
  get hex(): string {
    const alpha = Math.round(this.alpha * 255);

    return (
      '#' +
      this.red.toString(16).padStart(2, '0') +
      this.green.toString(16).padStart(2, '0') +
      this.blue.toString(16).padStart(2, '0') +
      alpha.toString(16).padStart(2, '0')
    );
  }

  /**
   * @param color Another color.
   * @returns Wheter the color equals to another one.
   */
  equals(color: Color4): boolean {
    return this.red === color.red
      && this.green === color.green
      && this.blue === color.blue
      && this.alpha === color.alpha;
  }

  /**
   * Clones the current color.
   * @returns A cloned color.
   */
  clone(): Color4 {
    return new Color4(this.red, this.green, this.blue, this.alpha);
  }

  /**
   * @returns A string representation of this color.
   */
  toString(): string {
    return `${this.red},${this.green},${this.blue},${this.alpha}`;
  }
}
