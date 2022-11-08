import { Storyboard } from 'osu-classes';
import { FileFormat } from '../Enums';
import { mkdirSync, writeFileSync, dirname } from '../Utils/FileSystem';
import { StoryboardEventEncoder } from './Handlers';

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
    if (!path.endsWith(FileFormat.Storyboard)) {
      path += FileFormat.Storyboard;
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

    /**
     * Variable encoding is now temporary (???) disabled.
     * Some storyboards use weird invisible characters as variable names
     * which can break osu! storyboard decoder. 
     * Example: https://osu.ppy.sh/beatmapsets/774573#osu/1627968
     */
    const encoded: string[] = [
      `osu file format v${storyboard.fileFormat}`,
      StoryboardEventEncoder.encodeEventSection(storyboard),
    ];

    return encoded.join('\n\n') + '\n';
  }
}
