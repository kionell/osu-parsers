import { BeatmapColorDecoder } from './Handlers';
import { LineType, Section } from '../Enums';
import { IHasBeatmapColors, IParsingOptions } from '../Interfaces';
import { Decoder } from './Decoder';
import { SectionMap } from '../Utils/SectionMap';

/**
 * A decoder for human-readable file formats that consist of sections.
 */
export abstract class SectionDecoder<T> extends Decoder {
  /**
   * Current data lines.
   */
  protected _lines: string[] | null = null;

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
    if (this._shouldSkipLine(line)) {
      return LineType.Empty;
    }

    line = this._preprocessLine(line);

    // File format
    if (line.includes('osu file format v')) {
      return LineType.FileFormat;
    }

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
    return typeof line !== 'string' || !line || line.startsWith('//');
  }

  protected _stripComments(line: string): string {
    const index = line.indexOf('//');

    return index > 0 ? line.substring(0, index) : line;
  }

  protected _reset(): void {
    this._sectionMap.reset();
    this._lines = null;
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
