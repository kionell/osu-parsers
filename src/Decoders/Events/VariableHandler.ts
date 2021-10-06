/**
 * A decoder for storyboard variables.
 */
export abstract class VariableHandler {
  /**
   * Decodes all variables from storyboard lines.
   * @param lines Storyboard lines.
   * @returns Storyboard variables. 
   */
  static getVariables(lines: string[]): { [key: string]: string } {
    const variables: { [key: string]: string } = {};

    const startIndex = lines.findIndex((l) => l.includes('[Variables]'));

    // If file contains variables.
    if (startIndex !== -1) {
      let endIndex = startIndex + 1;

      // Parse all lines until a new section is encountered.
      while (endIndex < lines.length && !lines[endIndex].startsWith('[')) {
        // All variables start with $ sign.
        if (lines[endIndex].startsWith('$')) {
          const pair = lines[endIndex].substring(1).split('=');

          // If this variable is valid.
          if (pair.length === 2) {
            variables[pair[0]] = pair[1];
          }
        }

        ++endIndex;
      }

      lines.splice(startIndex, endIndex - startIndex);
    }

    return variables;
  }

  /**
   * Replaces all variable names in storyboard line with variable values. 
   * @param line Storyboard line.
   * @param variables Storyboard variables.
   * @returns 
   */
  static preProcess(line: string,
    variables: { [key: string]: string }): string {
    const keys = Object.keys(variables);

    if (!line.includes('$') || !keys.length) {
      return line;
    }

    keys.forEach((key) => {
      line = line.replace('$' + key, variables[key]);
    });

    return line;
  }
}
