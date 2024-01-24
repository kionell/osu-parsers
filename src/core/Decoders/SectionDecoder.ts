import { Decoder } from './Decoder';
import { BeatmapColorDecoder } from './Handlers';
import { SectionMap } from '../Utils/SectionMap';
import { Parsing } from '../Utils/Parsing';
import { LineType, Section } from '../Enums';
import {
  IHasBeatmapColors,
  IParsingOptions,
  IHasFileFormat,
} from '../Interfaces';

/**
 * A decoder for human-readable file formats that consist of sections.
 */
export abstract class SectionDecoder<T extends IHasFileFormat> extends Decoder {
  /**
   * Whether the first non-empty line of the file was found or not.
   */
  protected _foundFirstNonEmptyLine = false;

  /**
   * Section map of this decoder.
   */
  protected _sectionMap = new SectionMap();

  protected _getLines(data: any[]): string[] {
    let lines = null;

    if (data.constructor === Array) {
      lines = data;
    }

    if (!lines || !lines.length) {
      throw new Error('Data not found!');
    }

    return lines;
  }

  protected _parseLine(line: string, output: T): LineType {
    // File format
    if (!this._foundFirstNonEmptyLine && line.includes('osu file format v')) {
      /**
       * There is one known case of .osu file starting with "\uFEFF" symbol
       * We need to use trim function to handle it. 
       * Beatmap: https://osu.ppy.sh/beatmapsets/310499#osu/771496
       */
      const fileFormatLine = line.trim();

      try {
        if (fileFormatLine.startsWith('osu file format v')) {
          output.fileFormat = Parsing.parseInt(fileFormatLine.split('v')[1]);
        }

        return LineType.FileFormat;
      }
      catch {
        throw new Error('Wrong file format version!');
      }
    }

    /**
     * We assume that the first line should be the file format.
     * But unfortunately it turns out that files can start with empty lines.
     * Beatmap: https://osu.ppy.sh/beatmapsets/574129#taiko/1485848
     * 
     * After some testing it was discovered that the actual game is able 
     * to decode the files with no file format line at all.
     * The game accepts file format only from the first non-empty line.
     */
    if (!this._foundFirstNonEmptyLine && !this._isEmptyLine(line)) {
      this._foundFirstNonEmptyLine = true;
    }

    if (this._shouldSkipLine(line)) {
      return LineType.Empty;
    }

    line = this._preprocessLine(line);

    // A file section
    if (line.startsWith('[') && line.endsWith(']')) {
      const section = line.slice(1, -1);

      if (this._sectionMap.currentSection) {
        // Disable already processed section.
        this._sectionMap.set(this._sectionMap.currentSection, false);

        // Remove current section in case the next section is unknown.
        this._sectionMap.currentSection = null;
      }

      if (!this._sectionMap.hasEnabledSections) {
        return LineType.Break;
      }

      if (section in Section) {
        this._sectionMap.currentSection = section as Section;
      }

      return LineType.Section;
    }

    // Skip disabled sections
    if (!this._sectionMap.isSectionEnabled) {
      return LineType.Empty;
    }

    try {
      // Section data
      this._parseSectionData(line, output);

      return LineType.Data;
    }
    catch {
      return LineType.Empty;
    }
  }

  protected _parseSectionData(line: string, output: T): void {
    const outputWithColors = output as T & IHasBeatmapColors;

    if (this._sectionMap.currentSection !== Section.Colours) {
      return;
    }

    if (!outputWithColors?.colors) return;

    BeatmapColorDecoder.handleLine(line, outputWithColors);
  }

  protected _preprocessLine(line: string): string {
    if (this._sectionMap.currentSection !== Section.Metadata) {
      /**
       * Comments should not be stripped from metadata lines, 
       * as the song metadata may contain "//" as valid data.
       */
      line = this._stripComments(line);
    }

    return line.trimEnd();
  }

  protected _shouldSkipLine(line: string): boolean {
    return this._isEmptyLine(line) || line.startsWith('//');
  }

  protected _isEmptyLine(line: string): boolean {
    return typeof line !== 'string' || !line;
  }

  protected _stripComments(line: string): string {
    const index = line.indexOf('//');

    return index > 0 ? line.substring(0, index) : line;
  }

  protected _reset(): void {
    this._sectionMap.reset();
    this._foundFirstNonEmptyLine = false;
  }

  /**
   * Sets current enabled sections.
   * All known sections are enabled by default.
   * @param options Parsing options.
   */
  protected _setEnabledSections(options?: IParsingOptions): void {
    this._sectionMap.set(Section.Colours, options?.parseColours);
  }
}
