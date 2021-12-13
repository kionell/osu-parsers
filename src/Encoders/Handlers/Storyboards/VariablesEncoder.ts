import { Storyboard } from 'osu-classes';

/**
 * An encoder for storyboard variables
 */
export abstract class VariablesEncoder {
  /**
   * Encodes all storyboard variables.
   * @param storyboard A storyboard.
   * @returns Encoded storyboard variables.
   */
  static encodeVariables(storyboard: Storyboard): string {
    const encoded: string[] = [];

    const variables = Object.entries(storyboard.variables);

    if (variables.length > 0) {
      encoded.push('[Variables]');

      variables.forEach((pair) => {
        encoded.push(`${pair[0]}=${pair[1]}`);
      });
    }

    return encoded.join('\n');
  }
}
