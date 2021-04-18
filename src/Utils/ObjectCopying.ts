export abstract class ObjectCopying {
  static copy<T>(input: T, deep = false): T {
    // Return the value if input is not an object.
    if (typeof input !== 'object' || input === null) {
      return input;
    }

    // Create an array or object to hold the values.
    const output: any = Array.isArray(input) ? [] : {};

    for (const key in input) {
      // Choose between recursive (deep) and shallow copy.
      output[key] = deep ? ObjectCopying.copy(input[key]) : input[key];
    }

    return output;
  }
}
