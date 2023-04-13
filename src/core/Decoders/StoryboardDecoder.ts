import { Storyboard } from 'osu-classes';
import { SectionDecoder } from './SectionDecoder';
import { Parsing } from '../Utils/Parsing';
import { BufferLike, stringifyBuffer } from '../Utils/Buffer';
import { FileFormat, LineType, Section } from '../Enums';

import {
  StoryboardGeneralDecoder,
  StoryboardEventDecoder,
  StoryboardVariableDecoder,
} from './Handlers';

/**
 * A storyboard decoder.
 */
export class StoryboardDecoder extends SectionDecoder<Storyboard> {
  /**
   * Current section name.
   */
  private _variables: Map<string, string> = new Map();

  /**
   * Performs storyboard decoding from the specified `.osu` or `.osb` file.
   * If two paths were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstPath The path to the main storyboard (`.osu` or `.osb` file).
   * @param secondPath The path to the secondary storyboard (`.osb` file).
   * @throws If file doesn't exist or can't be decoded.
   * @returns A decoded storyboard.
   */
  async decodeFromPath(firstPath: string, secondPath?: string): Promise<Storyboard> {
    if (!firstPath.endsWith(FileFormat.Beatmap) && !firstPath.endsWith(FileFormat.Storyboard)) {
      throw new Error(`Wrong format of the first file! Only ${FileFormat.Beatmap} and ${FileFormat.Storyboard} files are supported!`);
    }

    if (typeof secondPath === 'string') {
      if (!secondPath.endsWith(FileFormat.Storyboard)) {
        throw new Error(`Wrong format of the second file! Only ${FileFormat.Storyboard} files are supported as a second argument!`);
      }
    }

    try {
      const firstData = await this._getFileBuffer(firstPath);
      const secondData = typeof secondPath === 'string'
        ? await this._getFileBuffer(firstPath)
        : undefined;

      return this.decodeFromBuffer(firstData, secondData);
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to decode a storyboard! Reason: ${reason}`);
    }
  }

  /**
   * Performs storyboard decoding from a data buffer.
   * If two data buffers were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstBuffer The buffer with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondBuffer The buffer with the secondary storyboard data (from `.osb` file).
   * @throws If storyboard data can't be decoded.
   * @returns A decoded storyboard.
   */
  decodeFromBuffer(firstBuffer: BufferLike, secondBuffer?: BufferLike): Storyboard {
    const firstString = stringifyBuffer(firstBuffer);
    const secondString = secondBuffer ? stringifyBuffer(secondBuffer) : undefined;

    return this.decodeFromString(firstString, secondString);
  }

  /**
   * Performs storyboard decoding from a string.
   * If two strings were specified, storyboard decoder will try to combine storyboards.
   * 
   * NOTE: Commands from the `.osb` file take precedence over those 
   * from the `.osu` file within the layers, as if the commands 
   * from the `.osb` were appended to the end of the `.osu` commands.
   * @param firstString The string with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondString The string with the secondary storyboard data (from `.osb` file).
   * @throws If storyboard data can't be decoded.
   * @returns A decoded storyboard.
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
   * @param firstData The string array with the main storyboard data (from `.osu` or `.osb` file).
   * @param secondData The string array with the secondary storyboard data (from `.osb` file).
   * @throws If storyboard data can't be decoded.
   * @returns A decoded storyboard.
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
      const type = this._parseLine(this._lines[i], storyboard);

      // Break early if we parsed all enabled sections.
      if (type === LineType.Break) break;
    }

    storyboard.variables = this._variables;

    return storyboard;
  }

  protected _parseLine(line: string, storyboard: Storyboard): LineType {
    // .osu or .osb file version
    if (line.includes('osu file format v')) {
      storyboard.fileFormat = Parsing.parseInt(line.split('v')[1]);

      return LineType.FileFormat;
    }

    return super._parseLine(line, storyboard);
  }

  protected _parseSectionData(line: string, storyboard: Storyboard): void {
    switch (this._sectionMap.currentSection) {
      case Section.General:
        return StoryboardGeneralDecoder.handleLine(line, storyboard);

      case Section.Events:
        return StoryboardEventDecoder.handleLine(line, storyboard);

      case Section.Variables:
        return StoryboardVariableDecoder.handleLine(line, this._variables);
    }

    super._parseSectionData(line, storyboard);
  }

  /**
   * Sets current enabled sections.
   * All known sections are enabled by default.
   */
  protected _setEnabledSections(): void {
    super._setEnabledSections();

    this._sectionMap.set(Section.General);
    this._sectionMap.set(Section.Variables);
    this._sectionMap.set(Section.Events);
  }

  protected _preprocessLine(line: string): string {
    // Preprocess variables in the current line.
    line = StoryboardVariableDecoder.decodeVariables(line, this._variables);

    return super._preprocessLine(line);
  }

  protected _reset(): void {
    super._reset();

    this._sectionMap.reset();

    /**
     * Set 'Events' section as default one.
     * This helps to avoid issues with missing section 
     * at the beggining when merging two files.
     */
    this._sectionMap.currentSection = Section.Events;
  }
}
