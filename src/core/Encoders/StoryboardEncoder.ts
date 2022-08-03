import { mkdirSync, writeFileSync, dirname } from '../Utils/FileSystem';
import { Storyboard } from 'osu-classes';

import {
  StoryboardVariableEncoder,
  StoryboardEventEncoder,
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
  encodeToPath(path: string, storyboard?: Storyboard): void {
    if (!path.endsWith('.osb')) {
      path += '.osb';
    }

    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, this.encodeToString(storyboard));
  }

  /**
   * Performs storyboard encoding to a string.
   * @param storyboard Storyboard for encoding.
   * @returns A string with encoded storyboard data.
   */
  encodeToString(storyboard?: Storyboard): string {
    if (!(storyboard instanceof Storyboard)) return '';

    const encoded: string[] = [
      `osu file format v${storyboard.fileFormat}`,
    ];

    if (storyboard.hasVariables) {
      encoded.push(StoryboardVariableEncoder.encodeVariables(storyboard));
    }

    encoded.push(StoryboardEventEncoder.encodeEventSection(storyboard));

    return encoded.join('\n\n') + '\n';
  }
}
