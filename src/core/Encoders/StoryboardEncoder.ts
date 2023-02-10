import { Storyboard } from 'osu-classes';
import { FileFormat } from '../Enums';
import { mkdir, writeFile, dirname } from '../Utils/FileSystem';
import { StoryboardEventEncoder } from './Handlers';

/**
 * Storyboard encoder.
 */
export class StoryboardEncoder {
  /**
   * Performs storyboard encoding to the specified path.
   * @param path The path for writing the .osb file.
   * @param storyboard The storyboard for encoding.
   * @throws If storyboard can't be encoded or file can't be written.
   */
  async encodeToPath(path: string, storyboard?: Storyboard): Promise<void> {
    if (!path.endsWith(FileFormat.Storyboard)) {
      path += FileFormat.Storyboard;
    }

    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, await this.encodeToString(storyboard));
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Storyboard can't be encoded! Reason: ${reason}`);
    }
  }

  /**
   * Performs storyboard encoding to a string.
   * @param storyboard The storyboard for encoding.
   * @returns The string with encoded storyboard data.
   */
  async encodeToString(storyboard?: Storyboard): Promise<string> {
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
