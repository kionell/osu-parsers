export class Parsing {
  /**
   * Max value for slider path distance.
   */
  static readonly MAX_COORDINATE_VALUE = 131072;

  /**
   * Max parse value for all properties.
   */
  static readonly MAX_PARSE_VALUE = 2147483647;

  static parseInt(input: string, parseLimit = this.MAX_PARSE_VALUE): number {
    return this._getValue(parseInt(input), parseLimit);
  }

  static parseFloat(input: string, parseLimit = this.MAX_PARSE_VALUE): number {
    return this._getValue(parseFloat(input), parseLimit);
  }

  private static _getValue(value: number, parseLimit = this.MAX_PARSE_VALUE): number {
    if (value < -parseLimit) {
      throw new Error('Value is too low!');
    }

    if (value > parseLimit) {
      throw new Error('Value is too high!');
    }

    if (Number.isNaN(value)) {
      throw new Error('Not a number');
    }

    return value;
  }
}
