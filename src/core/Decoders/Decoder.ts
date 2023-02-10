import { access, readFile, stat } from '../Utils/FileSystem';

/**
 * A basic decoder for readable file formats.
 */
export abstract class Decoder {
  /**
   * Tries to read a file by its path in file system. 
   * @param path A path to the file.
   * @throws If file doesn't exist or it can't be read.
   * @returns A file buffer.
   */
  protected async _getFileBuffer(path: string): Promise<Uint8Array> {
    try {
      await access(path);
    }
    catch {
      throw new Error('File doesn\'t exist!');
    }

    try {
      return await readFile(path);
    }
    catch {
      throw new Error('File can\'t be read!');
    }
  }

  /**
   * Tries to get last update date of a file by its path in file system.
   * @param path A path to the file.
   * @throws If file can't be read.
   * @returns Last file update date.
   */
  protected async _getFileUpdateDate(path: string): Promise<Date> {
    try {
      return (await stat(path)).mtime;
    }
    catch {
      throw new Error('Failed to get last file update date!');
    }
  }
}
