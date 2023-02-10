import { Storyboard } from 'osu-classes';
import { Decoder } from './Decoder';
import { Parsing } from '../Utils/Parsing';
import { existsSync, readFileSync } from '../Utils/FileSystem';
import { FileFormat } from '../Enums';

import {
  StoryboardGeneralDecoder,
  StoryboardEventDecoder,
  StoryboardVariableDecoder,
} from './Handlers';
import { BufferLike } from '../Utils/Buffer';

/**
 * Storyboard decoder.
 */
export class StoryboardDecoder extends Decoder<Storyboard> {
  /**
   * Current section name.
   */
  private _variables: Record<string, string> = {};

  /**
   * Performs storyboard decoding from the specified `.osu` or `.osb` file.
   * If two paths were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstPath Path to the main storyboard (`.osu` or `.osb` file).
   * @param secondPath Path to the secondary storyboard (`.osb` file).
   * @returns Decoded storyboard.
   */
  decodeFromPath(firstPath: string, secondPath?: string): Storyboard {
    if (!firstPath.endsWith(FileFormat.Beatmap) && !firstPath.endsWith(FileFormat.Storyboard)) {
      throw new Error(`Wrong file format! Only ${FileFormat.Beatmap} and ${FileFormat.Storyboard} files are supported!`);
    }

    if (!existsSync(firstPath)) {
      throw new Error('File doesn\'t exists!');
    }

    if (typeof secondPath === 'string') {
      if (!secondPath.endsWith(FileFormat.Storyboard)) {
        throw new Error(`Wrong file format! Only ${FileFormat.Storyboard} files are supported as a second argument!`);
      }

      if (!existsSync(secondPath)) {
        throw new Error('File doesn\'t exists!');
      }
    }

    try {
      const firstString = readFileSync(firstPath).toString();
      const secondString = typeof secondPath === 'string'
        ? readFileSync(secondPath).toString()
        : undefined;

      return this.decodeFromString(firstString, secondString);
    }
    catch {
      throw new Error('Failed to read one of the files!');
    }
  }

  /**
   * Performs storyboard decoding from a data buffer.
   * If two data buffers were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstBuffer A buffer with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondBuffer A buffer with the secondary storyboard data (from `.osb` file).
   * @returns Decoded storyboard.
   */
  decodeFromBuffer(firstBuffer: BufferLike, secondBuffer?: BufferLike): Storyboard {
    const firstString = firstBuffer.toString();
    const secondString = secondBuffer?.toString();

    return this.decodeFromString(firstString, secondString);
  }

  /**
   * Performs storyboard decoding from a string.
   * If two strings were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstString A string with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondString A string with the secondary storyboard data (from `.osb` file).
   * @returns Decoded storyboard.
   */
  decodeFromString(firstString: string, secondString?: string): Storyboard {
    if (typeof firstString !== 'string') {
      firstString = String(firstString);
    }

    if (typeof secondString !== 'string' && typeof secondString !== 'undefined') {
      secondString = String(secondString);
    }

    const firstData = firstString.split(/\r?\n/);
    const secondData = secondString?.split(/\r?\n/);

    return this.decodeFromLines(firstData, secondData);
  }

  /**
   * Performs storyboard decoding from a string array.
   * If two string arrays were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstData A string array with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondData A string array with the secondary storyboard data (from `.osb` file).
   * @returns Decoded storyboard.
   */
  decodeFromLines(firstData: string[], secondData?: string[]): Storyboard {
    const storyboard = new Storyboard();

    this._reset();
    this._setEnabledSections();

    this._lines = [
      ...this._getLines(firstData),
      ...(secondData ? this._getLines(secondData) : []),
    ];

    // Parse storyboard lines.
    for (let i = 0; i < this._lines.length; ++i) {
      this._parseLine(this._lines[i], storyboard);
    }

    storyboard.variables = this._variables;

    return storyboard;
  }

  protected _parseLine(line: string, storyboard: Storyboard): void {
    // .osu or .osb file version
    if (line.includes('osu file format v')) {
      storyboard.fileFormat = Parsing.parseInt(line.split('v')[1]);

      return;
    }

    super._parseLine(line, storyboard);
  }

  protected _parseSectionData(line: string, storyboard: Storyboard): void {
    switch (this._section) {
      case 'General':
        return StoryboardGeneralDecoder.handleLine(line, storyboard);

      case 'Events':
        return StoryboardEventDecoder.handleLine(line, storyboard);

      case 'Variables':
        return StoryboardVariableDecoder.handleLine(line, this._variables);
    }

    super._parseSectionData(line, storyboard);
  }

  protected _preprocessLine(line: string): string {
    // Preprocess variables in the current line.
    line = StoryboardVariableDecoder.decodeVariables(line, this._variables);

    return super._preprocessLine(line);
  }

  protected _reset(): void {
    super._reset();

    // Use 'Events' section by default.
    this._section = 'Events';
  }
}
