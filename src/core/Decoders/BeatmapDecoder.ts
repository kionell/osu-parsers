import { Beatmap } from 'osu-classes';

import {
  BeatmapGeneralDecoder,
  BeatmapEditorDecoder,
  BeatmapMetadataDecoder,
  BeatmapDifficultyDecoder,
  BeatmapEventDecoder,
  BeatmapHitObjectDecoder,
  BeatmapTimingPointDecoder,
} from './Handlers';

import { SectionDecoder } from './SectionDecoder';
import { StoryboardDecoder } from './StoryboardDecoder';
import { IBeatmapParsingOptions } from '../Interfaces';
import { Parsing } from '../Utils/Parsing';
import { BufferLike, stringifyBuffer } from '../Utils/Buffer';
import { FileFormat, LineType, Section } from '../Enums';

/**
 * A beatmap decoder.
 */
export class BeatmapDecoder extends SectionDecoder<Beatmap> {
  /**
   * An offset which needs to be applied to old beatmaps (v4 and lower) 
   * to correct timing changes that were applied at a game client level.
   */
  static readonly EARLY_VERSION_TIMING_OFFSET = 24;

  /** 
   * Current offset for all time values.
   */
  protected _offset = 0;

  /**
   * Current storyboard lines.
   */
  protected _sbLines: string[] | null = null;

  /**
   * Performs beatmap decoding from the specified .osu file.
   * @param path A path to the .osu file.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @throws If file doesn't exist or can't be decoded.
   * @returns A decoded beatmap.
   */
  async decodeFromPath(path: string, options?: boolean | IBeatmapParsingOptions): Promise<Beatmap> {
    if (!path.endsWith(FileFormat.Beatmap)) {
      throw new Error(`Wrong file format! Only ${FileFormat.Beatmap} files are supported!`);
    }

    try {
      const data = await this._getFileBuffer(path);
      const beatmap = this.decodeFromBuffer(data, options);

      beatmap.fileUpdateDate = await this._getFileUpdateDate(path);

      return beatmap;
    }
    catch (err: unknown) {
      const reason = (err as Error).message || err;

      throw new Error(`Failed to decode a beatmap! Reason: ${reason}`);
    }
  }

  /**
   * Performs beatmap decoding from a data buffer.
   * @param data The buffer with beatmap data.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @throws If beatmap data can't be decoded.
   * @returns A decoded beatmap.
   */
  decodeFromBuffer(data: BufferLike, options?: boolean | IBeatmapParsingOptions): Beatmap {
    return this.decodeFromString(stringifyBuffer(data), options);
  }

  /**
   * Performs beatmap decoding from a string.
   * @param str The string with beatmap data.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * All sections that weren't specified will be enabled by default.
   * @throws If beatmap data can't be decoded.
   * @returns A decoded beatmap.
   */
  decodeFromString(str: string, options?: boolean | IBeatmapParsingOptions): Beatmap {
    str = typeof str !== 'string' ? String(str) : str;

    return this.decodeFromLines(str.split(/\r?\n/), options);
  }

  /**
   * Performs beatmap decoding from a string array.
   * @param data The array of split lines.
   * @param options Beatmap parsing options.
   * Setting this to boolean will only affect storyboard parsing.
   * @throws If beatmap data can't be decoded.
   * @returns A decoded beatmap.
   */
  decodeFromLines(data: string[], options?: boolean | IBeatmapParsingOptions): Beatmap {
    const beatmap = new Beatmap();

    this._reset();
    this._lines = this._getLines(data);

    this._setEnabledSections(options);

    // This array isn't needed if we don't parse a storyboard. 
    this._sbLines = this._shouldParseStoryboard(options) ? [] : null;

    /**
     * There is one known case of .osu file starting with "\uFEFF" symbol
     * We need to use trim function to handle it. 
     * Beatmap: https://osu.ppy.sh/beatmapsets/310499#osu/771496
     */
    const fileFormatLine = this._lines[0].trim();

    if (!fileFormatLine.startsWith('osu file format v')) {
      throw new Error('Not a valid beatmap!');
    }

    // Parse beatmap lines.
    for (let i = 0; i < this._lines.length; ++i) {
      const type = this._parseLine(this._lines[i], beatmap);

      // Break early if we parsed all enabled sections.
      if (type === LineType.Break) break;
    }

    // Flush last control point group.
    BeatmapTimingPointDecoder.flushPendingPoints();

    // Apply default values to the all hit objects.
    for (let i = 0; i < beatmap.hitObjects.length; ++i) {
      beatmap.hitObjects[i].applyDefaults(beatmap.controlPoints, beatmap.difficulty);
    }

    // Use stable sorting to keep objects in the right order.
    beatmap.hitObjects.sort((a, b) => a.startTime - b.startTime);

    // Storyboard
    if (this._sbLines && this._sbLines.length) {
      const storyboardDecoder = new StoryboardDecoder();

      beatmap.events.storyboard = storyboardDecoder.decodeFromLines(this._sbLines);

      /**
       * Because we parsed storyboard through beatmap decoder
       * we need to copy these properties from beatmap directly.
       */
      beatmap.events.storyboard.useSkinSprites = beatmap.general.useSkinSprites;
      beatmap.events.storyboard.colors = beatmap.colors;
      beatmap.events.storyboard.fileFormat = beatmap.fileFormat;
    }

    return beatmap;
  }

  protected _parseLine(line: string, beatmap: Beatmap): LineType {
    // .osu file version
    if (line.includes('osu file format v')) {
      beatmap.fileFormat = Parsing.parseInt(line.split('v')[1]);

      return LineType.FileFormat;
    }

    return super._parseLine(line, beatmap);
  }

  protected _parseSectionData(line: string, beatmap: Beatmap): void {
    switch (this._sectionMap.currentSection) {
      case Section.General:
        return BeatmapGeneralDecoder.handleLine(line, beatmap, this._offset);

      case Section.Editor:
        return BeatmapEditorDecoder.handleLine(line, beatmap);

      case Section.Metadata:
        return BeatmapMetadataDecoder.handleLine(line, beatmap);

      case Section.Difficulty:
        return BeatmapDifficultyDecoder.handleLine(line, beatmap);

      case Section.Events:
        return BeatmapEventDecoder.handleLine(line, beatmap, this._sbLines, this._offset);

      case Section.TimingPoints:
        return BeatmapTimingPointDecoder.handleLine(line, beatmap, this._offset);

      case Section.HitObjects:
        return BeatmapHitObjectDecoder.handleLine(line, beatmap, this._offset);
    }

    super._parseSectionData(line, beatmap);
  }

  /**
   * Sets current enabled sections.
   * All known sections are enabled by default.
   * @param options Parsing options.
   */
  protected _setEnabledSections(options?: boolean | IBeatmapParsingOptions): void {
    super._setEnabledSections(options);

    if (typeof options === 'boolean') return;

    this._sectionMap.set(Section.General, options?.parseGeneral);
    this._sectionMap.set(Section.Editor, options?.parseEditor);
    this._sectionMap.set(Section.Metadata, options?.parseMetadata);
    this._sectionMap.set(Section.Difficulty, options?.parseDifficulty);
    this._sectionMap.set(Section.Events, options?.parseEvents);
    this._sectionMap.set(Section.TimingPoints, options?.parseTimingPoints);
    this._sectionMap.set(Section.HitObjects, options?.parseHitObjects);
  }

  protected _shouldParseStoryboard(options?: boolean | IBeatmapParsingOptions): boolean {
    const parsingOptions = options as IBeatmapParsingOptions;
    const storyboardFlag = parsingOptions?.parseStoryboard ?? options as boolean;

    const parseSb = typeof storyboardFlag === 'boolean' ? storyboardFlag : true;
    const parseEvents = parsingOptions?.parseEvents ?? true;

    // Storyboard should be parsed only if both events and storyboard flags are enabled.
    return parseEvents && parseSb;
  }
}
