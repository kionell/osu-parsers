import { writeFileSync } from 'fs';

import { Storyboard } from 'osu-resources';

import {
  VariablesEncoder,
  EventsEncoder,
} from './Handlers';

/**
 * Storyboard encoder.
 */
export class StoryboardEncoder {
  /**
   * Performs storyboard encoding to the specified path.
   * @param path Path for writing the .osb file.
   * @param storyboard Storyboard for encoding.
   */
  encodeToPath(path: string, storyboard: Storyboard): void {
    if (!path.endsWith('.osb')) {
      path += '.osb';
    }

    writeFileSync(path, this.encodeToString(storyboard));
  }

  /**
   * Performs storyboard encoding to a string.
   * @param storyboard Storyboard for encoding.
   * @returns A string with encoded storyboard data.
   */
  encodeToString(storyboard: Storyboard): string {
    const encoded: string[] = [];

    if (storyboard instanceof Storyboard) {
      encoded.push(VariablesEncoder.encodeVariables(storyboard));
      encoded.push(EventsEncoder.encodeStoryboard(storyboard));
    }

    return encoded.filter((x) => x).join('\n\n');
  }
}
