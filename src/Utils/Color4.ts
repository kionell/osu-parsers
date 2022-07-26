/**
 * A color.
 */
export class Color4 {
  /**
   * The red value of the color.
   */
  red: number;

  /**
   * The green value of the color.
   */
  green: number;

  /**
   * The blue value of the color.
   */
  blue: number;

  /**
   * The alpha value of the color.
   */
  alpha: number;

  /**
   * Creates a new color.
   * @param red Red value of the color.
   * @param green Green value of the color.
   * @param blue Blue value of the color.
   * @param alpha Alpha value of the color.
   */
  constructor(red?: number, green?: number, blue?: number, alpha?: number) {
    this.red = red || 0;
    this.green = green || 0;
    this.blue = blue || 0;
    this.alpha = alpha || 255;
  }

  /**
   * The HEX representation of the color.
   */
  get hex(): string {
    return (
      '#' +
      this.red.toString(16).padStart(2, '0') +
      this.green.toString(16).padStart(2, '0') +
      this.blue.toString(16).padStart(2, '0') +
      this.alpha.toString(16).padStart(2, '0')
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
