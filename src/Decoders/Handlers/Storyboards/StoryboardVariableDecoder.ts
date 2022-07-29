/**
 * A decoder for storyboard variables.
 */
export abstract class StoryboardVariableDecoder {
  /**
   * Decodes all variables from storyboard lines.
   * @param line A storyboard line.
   * @param variables Variables dictionary.
   * @returns Storyboard variables. 
   */
  static handleLine(line: string, variables: Record<string, string>): void {
    if (!line.startsWith('$')) return;

    const pair = line.split('=');

    // If this variable is valid.
    if (pair.length === 2) {
      variables[pair[0]] = pair[1].trimEnd();
    }
  }

  /**
   * Replaces all variable names in storyboard line with variable values. 
   * @param line A storyboard line.
   * @param variables Storyboard variables.
   * @returns A storyboard line with replaced variables
   */
  static decodeVariables(line: string, variables: Record<string, string>): string {
    const keys = Object.keys(variables);

    if (!line.includes('$') || !keys.length) {
      return line;
    }

    keys.forEach((key) => {
      line = line.replace(key, variables[key]);
    });

    return line;
  }
}
