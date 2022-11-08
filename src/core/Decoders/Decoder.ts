import { BeatmapColorDecoder } from './Handlers';
import { Section } from '../Enums';
import { EnabledSections, IHasBeatmapColors, IParsingOptions } from '../Interfaces';

/**
 * Basic decoder for readable file formats.
 */
export abstract class Decoder<T> {
  /**
   * Current file section.
   */
  protected _section: keyof typeof Section | null = null;

  /**
   * Current data lines.
   */
  protected _lines: string[] | null = null;

  /**
   * Current parsing options.
   */
  declare protected _enabledSections: EnabledSections;

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

  protected _parseLine(line: string, output: T): void {
    if (this._shouldSkipLine(line)) return;

    line = this._preprocessLine(line);

    // File format
    if (line.includes('osu file format v')) return;

    // A file section
    if (line.startsWith('[') && line.endsWith(']')) {
      const section = line.slice(1, -1);

      if (section in Section) {
        this._section = section as keyof typeof Section;
      }

      return;
    }

    // Skip disabled sections
    if (!this._isSectionEnabled()) return;

    try {
      // Section data
      this._parseSectionData(line, output);
    }
    catch {
      return;
    }
  }

  protected _parseSectionData(line: string, output: T): void {
    const outputWithColors = output as T & IHasBeatmapColors;

    if (this._section !== 'Colours' || !outputWithColors?.colors) return;

    BeatmapColorDecoder.handleLine(line, outputWithColors);
  }

  protected _preprocessLine(line: string): string {
    if (this._section !== 'Metadata') {
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
    this._section = null;
    this._lines = null;
  }

  /**
   * Sets current enabled sections.
   * All sections are enabled by default.
   * @param options Parsing options.
   */
  protected _setEnabledSections(options?: boolean | IParsingOptions): void {
    const enabledSections: Partial<EnabledSections> = {};

    for (const section in Section) {
      // Skip numbers
      if (!isNaN(parseInt(section))) continue;

      enabledSections[section as keyof typeof Section] = true;
    }

    if (typeof options !== 'boolean') {
      enabledSections.Colours = options?.parseColours ?? true;
    }

    this._enabledSections = enabledSections as EnabledSections;
  }

  /**
   * Check if current section is enabled and should be parsed.
   * Unknown sections are enabled by default.
   * @returns If this section is enabled.
   */
  protected _isSectionEnabled(): boolean {
    return this._section ? this._enabledSections[this._section] : true;
  }
}
