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

  static parseEnum<T>(enumObj: T, input: string): T[keyof T] {
    const value = input.trim();
    const rawValue = parseInt(value);

    const values = Object.values(enumObj);

    if (values.some((v) => v === rawValue)) {
      return rawValue as unknown as T[keyof T];
    }

    if (values.some((v) => v === value)) {
      return (enumObj as any)[value] as T[keyof T];
    }

    throw new Error('Unknown enum value!');
  }

  static parseByte(input: string): number {
    const value = parseInt(input);

    if (value < 0) {
      throw new Error('Value must be greater than 0!');
    }

    if (value > 255) {
      throw new Error('Value must be less than 255!');
    }

    return this._getValue(value);
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
